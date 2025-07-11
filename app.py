
from flask import Flask, render_template, request, redirect
import gspread
from oauth2client.service_account import ServiceAccountCredentials

from options import MODE_OPTIONS, DOCTOR_OPTIONS, TIMING_OPTIONS, STATUS_OPTIONS, NURSE_OPTIONS

app = Flask(__name__)

# Google Sheets setup
SCOPE = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
CREDS_FILE = "creds/service_account.json"
SPREADSHEET_NAME = "Patient Enquiry"

credentials = ServiceAccountCredentials.from_json_keyfile_name(CREDS_FILE, SCOPE)
client = gspread.authorize(credentials)
sheet = client.open(SPREADSHEET_NAME).sheet1

@app.route('/')
def index():
    data = sheet.get_all_values()
    if not data:
        return "Sheet is empty"

    headers = data[0]
    rows = data[1:]
    open_items = []

    for i, row in enumerate(rows):
     if len(row) < len(headers):
      row += [''] * (len(headers) - len(row))
     row_dict = dict(zip(headers, row))
     status = row_dict.get("Status", "").strip().lower()
     if status not in ["completed", "cancelled"]:
      open_items.append({**row_dict, "row_number": i + 2})

    return render_template("frontend.xml",
                           open_items=open_items, 
                           mode_options=MODE_OPTIONS,
                           timing_options=TIMING_OPTIONS,
                           doctor_options=DOCTOR_OPTIONS,
                           status_options=STATUS_OPTIONS,
	                           nurse_options=NURSE_OPTIONS)
    if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

@app.route('/submit', methods=['POST'])
def submit():
    if request.form['action'] == 'cancel':
        return redirect('/') 
    values = [
        request.form['Date'],
        request.form['Mode'],
        request.form['Name'],
        request.form['Mobile'],
        request.form['AppDate'],
        request.form['Timing'],
        request.form['Doctor'],
        request.form['RequestFor'],
        request.form['Comment'],
        request.form['Status'],
        request.form['AttendedBy'],
        request.form['HandoverTo']
    ]
    sheet.append_row(values)
    return redirect('/')

@app.route('/edit/<int:row_number>', methods=['GET', 'POST'])
def edit(row_number):
    if row_number < 2:
        return "Invalid row number", 400
    if request.method == 'GET':
        headers = sheet.row_values(1)
        row = sheet.row_values(row_number)
        record = {k.replace(" ", ""): v for k, v in zip(headers, row)}
        return render_template("edit.xml",
                               record=record,
                               row_number=row_number,
	                           mode_options=MODE_OPTIONS,
        	                   timing_options=TIMING_OPTIONS,
                	           doctor_options=DOCTOR_OPTIONS,
                        	   status_options=STATUS_OPTIONS,
	                           nurse_options=NURSE_OPTIONS)
    else:
        if request.form['action'] == 'cancel':
            return redirect('/')
        updated = [
            request.form['Date'],
            request.form['Mode'],
            request.form['Name'],
            request.form['Mobile'],
            request.form['AppDate'],
            request.form['Timing'],
            request.form['Doctor'],
            request.form['RequestFor'],
            request.form['Comment'],
            request.form['Status'],
            request.form['AttendedBy'],
            request.form['HandoverTo']
        ]
        sheet.update(f"A{row_number}:L{row_number}", [updated])
        return redirect('/')

@app.route('/close/<int:row_number>', methods=['GET'])
def close(row_number):
    status = request.args.get('status')   # Get the ?status= value from the URL
    sheet.update_cell(row_number + 1, 10, status)  # column 10 = Status
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)

