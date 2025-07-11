from flask import Flask, request, render_template
import gspread
from oauth2client.service_account import ServiceAccountCredentials

app = Flask(__name__)

# Google Sheets setup
SCOPE = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
CREDS_FILE = 'creds/service_account.json'
SPREADSHEET_ID = '1LKsHauDuPjc4gCjrtJD8JqaLrzbvLehk2uFhJJ4fWeY'

credentials = ServiceAccountCredentials.from_json_keyfile_name(CREDS_FILE, SCOPE)
client = gspread.authorize(credentials)
sheet = client.open_by_key(SPREADSHEET_ID).sheet1

@app.route('/')
def index():
    data = sheet.get_all_values()

    if not data:
        return "Sheet is empty"

    headers = data[0]      # First row is header
    rows = data[1:]        # Remaining rows are data

    open_items = []

    for i, row in enumerate(rows):
        row_dict = dict(zip(headers, row))  # Convert list to dict
        if row_dict.get('status', '').lower() == 'open':
            open_items.append({
                'row_number': i + 2,  # Real row number in Google Sheet
                'patient_name': row_dict.get('patient_name', ''),
                'enquiry': row_dict.get('enquiry', '')
            })

    return render_template('frontend.xml', items=open_items)

@app.route('/submit', methods=['POST'])
def submit():
    name = request.form.get('name')
    enquiry = request.form.get('enquiry')
    if not name or not enquiry:
        return "Please fill in all fields", 400

    # Append new row
    sheet.append_row([name, enquiry, 'open'])
    return "Enquiry Submitted! <a href='/'>Go back</a>"

@app.route('/close/<int:row_number>')
def close_enquiry(row_number):
    sheet.update_cell(row_number, 3, 'closed')  # 3 = status column
    return "Enquiry Closed! <a href='/'>Go back</a>"


if __name__ == '__main__':
    app.run(debug=True)
