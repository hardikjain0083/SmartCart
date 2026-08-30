import sys
import cv2
import zxingcpp

def main():
    if len(sys.argv) < 2:
        print("Error: No image path provided", file=sys.stderr)
        sys.exit(1)
        
    image_path = sys.argv[1]
    
    try:
        img = cv2.imread(image_path)
        if img is None:
            print("NOT_FOUND")
            sys.exit(0)
            
        results = zxingcpp.read_barcodes(img)
        
        if len(results) == 0:
            print("NOT_FOUND")
            sys.exit(0)
            
        # Print the first detected barcode
        barcode = results[0].text
        print(barcode)
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
