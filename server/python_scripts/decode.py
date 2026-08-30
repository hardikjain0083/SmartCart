import sys
import cv2

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
            
        barcode_text = None

        # Try zxingcpp first (used locally on Windows)
        try:
            import zxingcpp
            results = zxingcpp.read_barcodes(img)
            if len(results) > 0:
                barcode_text = results[0].text
        except ImportError:
            pass
            
        # Fallback to pyzbar (used on Docker/Linux)
        if barcode_text is None:
            from pyzbar.pyzbar import decode
            results = decode(img)
            if len(results) > 0:
                barcode_text = results[0].data.decode('utf-8')
                
        if not barcode_text:
            print("NOT_FOUND")
            sys.exit(0)
            
        print(barcode_text)
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
