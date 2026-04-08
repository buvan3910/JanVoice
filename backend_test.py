#!/usr/bin/env python3

import requests
import sys
import base64
import io
from PIL import Image
from datetime import datetime

class ImageAnalysisAPITester:
    def __init__(self, base_url="https://visual-issues.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, test_func):
        """Run a single test"""
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            success = test_func()
            if success:
                self.tests_passed += 1
                print(f"✅ Passed")
            else:
                print(f"❌ Failed")
            return success
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False

    def create_test_image(self, format='JPEG', size=(200, 200), file_size_mb=None):
        """Create a test image with real visual features"""
        # Create an image with visual features (not solid color)
        img = Image.new('RGB', size, color='white')
        
        # Add some visual features - a simple pattern
        pixels = img.load()
        for i in range(size[0]):
            for j in range(size[1]):
                # Create a pattern with edges and textures
                if (i + j) % 20 < 10:
                    pixels[i, j] = (100, 150, 200)  # Blue
                elif i % 30 < 15:
                    pixels[i, j] = (200, 100, 100)  # Red
                else:
                    pixels[i, j] = (100, 200, 100)  # Green
        
        # Add some geometric shapes for better visual features
        from PIL import ImageDraw
        draw = ImageDraw.Draw(img)
        draw.rectangle([50, 50, 150, 150], outline='black', width=3)
        draw.ellipse([75, 75, 125, 125], fill='yellow')
        
        buffer = io.BytesIO()
        
        # Adjust quality to reach target file size if specified
        quality = 85
        if file_size_mb:
            target_size = file_size_mb * 1024 * 1024
            # Try different qualities to reach target size
            for q in range(10, 100, 10):
                buffer.seek(0)
                buffer.truncate()
                img.save(buffer, format=format, quality=q)
                if buffer.tell() >= target_size:
                    quality = q
                    break
        
        buffer.seek(0)
        buffer.truncate()
        img.save(buffer, format=format, quality=quality)
        buffer.seek(0)
        return buffer.getvalue()

    def test_valid_image_analysis(self):
        """Test valid image analysis"""
        # Create a test image with visual features
        image_data = self.create_test_image('JPEG')
        
        files = {'image': ('test_image.jpg', image_data, 'image/jpeg')}
        
        response = requests.post(f"{self.base_url}/ai/analyze-image", files=files)
        
        if response.status_code != 200:
            print(f"Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        data = response.json()
        required_fields = ['description', 'department', 'category', 'confidence']
        
        for field in required_fields:
            if field not in data:
                print(f"Missing required field: {field}")
                return False
        
        print(f"Analysis result: {data}")
        return True

    def test_invalid_image_type(self):
        """Test invalid image type (BMP)"""
        # Create a simple text file pretending to be an image
        fake_image = b"This is not an image"
        
        files = {'image': ('test.bmp', fake_image, 'image/bmp')}
        
        response = requests.post(f"{self.base_url}/ai/analyze-image", files=files)
        
        if response.status_code != 400:
            print(f"Expected 400, got {response.status_code}")
            return False
        
        data = response.json()
        if 'detail' not in data or 'Invalid image type' not in data['detail']:
            print(f"Expected invalid image type error, got: {data}")
            return False
        
        return True

    def test_oversized_image(self):
        """Test image larger than 5MB"""
        # Create a large image (over 5MB)
        large_image_data = self.create_test_image('JPEG', size=(2000, 2000), file_size_mb=6)
        
        files = {'image': ('large_image.jpg', large_image_data, 'image/jpeg')}
        
        response = requests.post(f"{self.base_url}/ai/analyze-image", files=files)
        
        if response.status_code != 400:
            print(f"Expected 400, got {response.status_code}")
            return False
        
        data = response.json()
        if 'detail' not in data or '5MB limit' not in data['detail']:
            print(f"Expected size limit error, got: {data}")
            return False
        
        return True

    def test_png_image(self):
        """Test PNG image analysis"""
        image_data = self.create_test_image('PNG')
        
        files = {'image': ('test_image.png', image_data, 'image/png')}
        
        response = requests.post(f"{self.base_url}/ai/analyze-image", files=files)
        
        if response.status_code != 200:
            print(f"Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        data = response.json()
        required_fields = ['description', 'department', 'category', 'confidence']
        
        for field in required_fields:
            if field not in data:
                print(f"Missing required field: {field}")
                return False
        
        return True

    def test_webp_image(self):
        """Test WEBP image analysis"""
        image_data = self.create_test_image('WEBP')
        
        files = {'image': ('test_image.webp', image_data, 'image/webp')}
        
        response = requests.post(f"{self.base_url}/ai/analyze-image", files=files)
        
        if response.status_code != 200:
            print(f"Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        data = response.json()
        required_fields = ['description', 'department', 'category', 'confidence']
        
        for field in required_fields:
            if field not in data:
                print(f"Missing required field: {field}")
                return False
        
        return True

    def test_missing_file(self):
        """Test request without file"""
        response = requests.post(f"{self.base_url}/ai/analyze-image")
        
        if response.status_code not in [400, 422]:
            print(f"Expected 400 or 422, got {response.status_code}")
            return False
        
        return True

    def test_corrupted_image(self):
        """Test corrupted image file"""
        # Create corrupted image data
        corrupted_data = b"corrupted image data that looks like jpeg header\xff\xd8\xff\xe0"
        
        files = {'image': ('corrupted.jpg', corrupted_data, 'image/jpeg')}
        
        response = requests.post(f"{self.base_url}/ai/analyze-image", files=files)
        
        # Should return 400 for invalid image
        if response.status_code != 400:
            print(f"Expected 400, got {response.status_code}")
            return False
        
        return True

def main():
    print("🚀 Starting Image Analysis API Tests")
    print("=" * 50)
    
    tester = ImageAnalysisAPITester()
    
    # Run all tests
    tests = [
        ("Valid JPEG Image Analysis", tester.test_valid_image_analysis),
        ("PNG Image Analysis", tester.test_png_image),
        ("WEBP Image Analysis", tester.test_webp_image),
        ("Invalid Image Type (BMP)", tester.test_invalid_image_type),
        ("Oversized Image (>5MB)", tester.test_oversized_image),
        ("Missing File", tester.test_missing_file),
        ("Corrupted Image", tester.test_corrupted_image),
    ]
    
    for test_name, test_func in tests:
        tester.run_test(test_name, test_func)
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())