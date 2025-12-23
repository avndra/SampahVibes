from http.server import BaseHTTPRequestHandler
import json
import re
import urllib.request
import urllib.error

# DATABASE MOCKUP: Barcode Botol Plastik Valid (Priority lookup)
VALID_PRODUCTS = {
    # Le Minerale
    "8996001600399": {"name": "Le Minerale 1500ml", "brand": "Le Minerale", "base_weight": 0.035},
    "8996001600375": {"name": "Le Minerale 330ml", "brand": "Le Minerale", "base_weight": 0.012},
    "8996001600269": {"name": "Le Minerale 600ml", "brand": "Le Minerale", "base_weight": 0.018},
    
    # Aqua
    "8886008101053": {"name": "Aqua 600ml", "brand": "Aqua", "base_weight": 0.016},
    "8992696404441": {"name": "Aqua 1500ml", "brand": "Aqua", "base_weight": 0.032},
    
    # Cleo
    "8996129800640": {"name": "Cleo 1500ml", "brand": "Cleo", "base_weight": 0.035},
    "8996129803504": {"name": "Cleo 550ml", "brand": "Cleo", "base_weight": 0.015},

    # Santri / Generic Demo
    "8991234567890": {"name": "Santri 600ml", "brand": "Santri", "base_weight": 0.016},
}


def estimate_bottle_weight(quantity_str: str, product: dict):
    """Estimate plastic bottle weight based on volume"""
    if not quantity_str:
        return 0.015  # Default 15g for unknown
    
    quantity_lower = quantity_str.lower()
    
    # Try to extract number and unit
    match = re.search(r'(\d+(?:\.\d+)?)\s*(ml|l|cl|litre|liter)?', quantity_lower)
    if match:
        value = float(match.group(1))
        unit = match.group(2) or 'ml'
        
        # Convert to ml
        if unit in ['l', 'litre', 'liter']:
            ml = value * 1000
        elif unit == 'cl':
            ml = value * 10
        else:
            ml = value
        
        # Estimate plastic bottle weight based on volume
        # Approximate: 10g base + 0.02g per ml
        weight_grams = 10 + (ml * 0.02)
        
        # Cap at realistic values for plastic bottles
        if weight_grams < 8:
            weight_grams = 8
        elif weight_grams > 50:
            weight_grams = 50
            
        return round(weight_grams / 1000, 3)  # Convert to kg
    
    return 0.015  # Default fallback


def lookup_open_food_facts(barcode: str):
    """Lookup product from Open Food Facts API"""
    try:
        url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}.json"
        req = urllib.request.Request(url, headers={'User-Agent': 'E-Recycle/1.0'})
        
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            
            if data.get("status") == 1 and data.get("product"):
                product = data["product"]
                
                # Extract product info
                product_name = product.get("product_name", "Unknown Product")
                brands = product.get("brands", "")
                quantity = product.get("quantity", "")
                
                # Build full name
                full_name = f"{brands} {product_name}".strip() if brands else product_name
                if quantity:
                    full_name += f" ({quantity})"
                
                # Estimate weight from quantity/packaging
                estimated_weight = estimate_bottle_weight(quantity, product)
                
                return {
                    "found": True,
                    "name": full_name,
                    "brand": brands,
                    "quantity": quantity,
                    "weight": estimated_weight
                }
        
        return {"found": False}
    except Exception as e:
        print(f"Open Food Facts API error: {e}")
        return {"found": False}


def scan_barcode(code: str):
    """Process barcode scanning logic"""
    # 1. Check local database first
    product_info = VALID_PRODUCTS.get(code)
    
    if product_info:
        # Use local database
        item_name = product_info['name']
        variation = (int(code[-1:]) % 5) / 1000 
        weight = round(product_info['base_weight'] + variation, 3)
    else:
        # 2. Try Open Food Facts API
        off_result = lookup_open_food_facts(code)
        
        if off_result.get("found"):
            item_name = off_result["name"]
            weight = off_result["weight"]
        else:
            # 3. Fallback - accept any valid barcode format
            # Valid barcode: 8+ digits
            if not code.isdigit() or len(code) < 8:
                return {
                    "error": "Format barcode tidak valid. Harus 8+ digit angka.",
                    "status": 400
                }
            
            # Accept any valid barcode with generic estimation
            item_name = "Botol Plastik (Unknown)"
            # Estimate weight based on barcode digits
            try:
                seed_val = int(code[-4:])
            except:
                seed_val = 999
            weight_grams = (seed_val % 25) + 15  # 15-40g range
            weight = round(weight_grams / 1000, 3)

    # Points Calculation
    points_per_kg = 1000
    points = int(points_per_kg * weight)
    
    if points < 5: 
        points = 5

    return {
        "barcode": code,
        "trashType": "Botol Plastik (PET)",
        "productName": item_name,
        "weight": weight,
        "pointsEarned": points,
        "message": f"Verified: {item_name}"
    }


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        response = {"status": "E-Recycle Python Service Running on Vercel"}
        self.wfile.write(json.dumps(response).encode())
    
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data.decode())
            
            code = body.get('code', '')
            
            if not code:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "No barcode provided"}).encode())
                return
            
            result = scan_barcode(code)
            
            if result.get("error"):
                self.send_response(result.get("status", 400))
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": result["error"]}).encode())
                return
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
