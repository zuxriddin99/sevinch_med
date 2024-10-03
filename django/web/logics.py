import re

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