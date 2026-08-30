import barcode
from barcode.writer import ImageWriter

# Generate barcodes for all demo products
demo_barcodes = {
    '8901234567890': 'Organic_Apple_Juice',
    '8901234567891': 'Whole_Wheat_Bread',
    '8901234567892': 'Almond_Milk',
    '8901234567893': 'Dark_Chocolate_Bar',
    '8901234567894': 'Arabica_Coffee_Beans',
}

for code, name in demo_barcodes.items():
    ean = barcode.get('ean13', code, writer=ImageWriter())
    filename = ean.save(f'test_barcodes/{name}_{code}')
    print(f'Generated: {filename}')

print('\nAll test barcode images saved in test_barcodes/ folder!')
print('Upload any of these images on the SmartCart scanner page to test.')
