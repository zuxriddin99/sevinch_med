import re
from typing import List


def convert_to_int(num_str):
    try:
        # Remove spaces and attempt to convert to an integer
        cleaned_num_str = num_str.replace(" ", "")
        return int(cleaned_num_str)
    except (ValueError, TypeError):
        # Return 0 if conversion fails due to non-numeric value or invalid input
        return 0

def phone_number_input_update(phone_number:str):
    # Remove parentheses, spaces, and other non-numeric characters
    cleaned_number = re.sub(r'\D', '', phone_number)
    # Add the country code prefix
    return '+998' + cleaned_number

def calculate_price(prices: List, treatments_count:int, paid: int, discount: int):
    # Initialize result data
    data = []
    total_price = 0

    # Loop through treatment counts to generate the payment data
    for i in range(1, treatments_count + 1):
        price = get_price(prices=prices, quantity=i)
        data.append({
            "name": f"{i}-muolaja.",
            "price": price
        })
        total_price += price

    # Prepare the result
    return {
        "data": data,
        "total_price": total_price,
        "price": total_price - discount,
        "paid": paid,
        "need_paid": total_price - paid - discount,
        "discount": discount
    }

def get_price(prices: List[dict], quantity: int):
    # Use filter to find the correct price range, or return the last price if no match is found
    price = next(filter(lambda x: x['start_quantity'] <= quantity <= x['end_quantity'], prices), None)
    # Return the matched price, or fallback to the last price in the list
    return price['price'] if price else prices[-1]['price']

def format_price(price: int):
    # Format the number with comma separators and replace commas with spaces
    return "{:,}".format(price).replace(',', ' ')