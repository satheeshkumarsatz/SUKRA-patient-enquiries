// ============================================================
//  SUKRA PATIENT ENQUIRIES - App Logic
//  Two actions (matches your original app):
//   1) Click NAME          -> full Edit Enquiry form (edit all fields)
//   2) Click Update Status -> quick status popup with buttons
// ============================================================

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let allRows = [];   // cache of open enquiries for instant search

// ---------- Startup ----------
window.addEventListener('DOMContentLoaded', () => {
  fillDropdowns();
  buildStatusButtons();
  loadEnquiries();
  document.getElementById('searchBox').addEventListener('input', doSearch);
});

// ---------- Dropdowns ----------
function fillDropdowns() {
  fillSelect('f_mode', MODE_OPTIONS);
  fillSelect('f_timing', TIMING_OPTIONS);
  fillSelect('f_doctor', DOCTOR_OPTIONS);
  fillSelect('f_status', STATUS_OPTIONS);
  fillSelect('f_attended', NURSE_OPTIONS);
}
function fillSelect(id, options) {
  document.getElementById(id).innerHTML =
    options.map(o => `<option value="${o}">${o}</option>`).join('');
}

// ---------- Build the quick-status buttons once ----------
function buildStatusButtons() {
  document.getElementById('statusButtons').innerHTML =
    STATUS_OPTIONS.map(s =>
      `<button class="btn-primary" onclick="applyStatus('${s.replace(/'/g, "\\'")}')">${s}</button>`
    ).join('');
}

// ---------- Load open enquiries ----------
async function loadEnquiries() {
  document.getElementById('loading').style.display = 'block';
  const { data, error } = await db
    .from('enquiries')
    .select('*')
    .not('status', 'in', '("Completed","Cancelled")')
    .order('id', { ascending: true });
  document.getElementById('loading').style.display = 'none';

  if (error) { alert('Error loading data: ' + error.message); return; }
  allRows = data || [];
  renderTable(allRows);
}

// ---------- Render table ----------
function renderTable(rows) {
  const body = document.getElementById('tableBody');
  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="14" style="text-align:center">No open enquiries</td></tr>`;
    return;
  }
  body.innerHTML = rows.map(r => `
    <tr>
      <td>${r.id}</td>
      <td>${r.enquiry_date || ''}</td>
      <td>${r.mode || ''}</td>
      <td><a href="#" class="name-link" onclick="editRecord(${r.id});return false;">${r.patient_name || ''}</a></td>
      <td>${r.mobile || ''}</td>
      <td>${r.appointment_date || ''}</td>
      <td>${r.timing || ''}</td>
      <td>${r.doctor || ''}</td>
      <td>${r.request_for || ''}</td>
      <td>${r.comments || ''}</td>
      <td>${r.status || ''}</td>
      <td>${r.attended_by || ''}</td>
      <td>${r.handover_to || ''}</td>
      <td><a href="#" onclick="openStatusPopup(${r.id});return false;">Update Status</a></td>
    </tr>`).join('');
}

// ---------- Instant search ----------
function doSearch() {
  const q = document.getElementById('searchBox').value.toLowerCase().trim();
  const rows = !q ? allRows : allRows.filter(r =>
    (r.patient_name || '').toLowerCase().includes(q) ||
    (r.mobile || '').toLowerCase().includes(q) ||
    (r.doctor || '').toLowerCase().includes(q));
  renderTable(rows);
}

// ============================================================
//  ACTION 2 : Update Status popup (quick buttons)
// ============================================================
function openStatusPopup(id) {
  document.getElementById('statusRecordId').value = id;
  document.getElementById('statusModal').style.display = 'flex';
}
function closeStatusPopup() {
  document.getElementById('statusModal').style.display = 'none';
}
async function applyStatus(status) {
  const id = document.getElementById('statusRecordId').value;
  const { error } = await db.from('enquiries').update({ status }).eq('id', id);
  if (error) { alert('Update failed: ' + error.message); return; }
  closeStatusPopup();
  loadEnquiries();   // Completed/Cancelled drop off the open list automatically
}

// ============================================================
//  ACTION 1 : Full Edit Enquiry form (click Name)
// ============================================================
function openForm() {              // + Submit New Enquiry (blank)
  document.getElementById('modalTitle').innerText = 'New Enquiry';
  document.getElementById('recordId').value = '';
  document.getElementById('f_date').value = new Date().toISOString().slice(0, 10);
  document.getElementById('f_name').value = '';
  document.getElementById('f_mobile').value = '';
  document.getElementById('f_mode').value = MODE_OPTIONS[0];
  document.getElementById('f_appdate').value = '';
  document.getElementById('f_timing').value = 'NONE';
  document.getElementById('f_doctor').value = DOCTOR_OPTIONS[0];
  document.getElementById('f_request').value = '';
  document.getElementById('f_comment').value = '';
  document.getElementById('f_status').value = 'Open';
  document.getElementById('f_attended').value = NURSE_OPTIONS[0];
  document.getElementById('f_handover').value = '';
  document.getElementById('modal').style.display = 'flex';
}

function editRecord(id) {          // click Name -> pre-filled edit
  const r = allRows.find(x => x.id === id);
  if (!r) return;
  document.getElementById('modalTitle').innerText = 'Edit Enquiry';
  document.getElementById('recordId').value = r.id;
  document.getElementById('f_date').value = r.enquiry_date || '';
  document.getElementById('f_name').value = r.patient_name || '';
  document.getElementById('f_mobile').value = r.mobile || '';
  document.getElementById('f_mode').value = r.mode || MODE_OPTIONS[0];
  document.getElementById('f_appdate').value = r.appointment_date || '';
  document.getElementById('f_timing').value = r.timing || 'NONE';
  document.getElementById('f_doctor').value = r.doctor || DOCTOR_OPTIONS[0];
  document.getElementById('f_request').value = r.request_for || '';
  document.getElementById('f_comment').value = r.comments || '';
  document.getElementById('f_status').value = r.status || 'Open';
  document.getElementById('f_attended').value = r.attended_by || NURSE_OPTIONS[0];
  document.getElementById('f_handover').value = r.handover_to || '';
  document.getElementById('modal').style.display = 'flex';
}

function closeForm() {
  document.getElementById('modal').style.display = 'none';
}

async function saveRecord() {      // Update button (insert new OR update existing)
  const id = document.getElementById('recordId').value;
  const record = {
    enquiry_date:     document.getElementById('f_date').value || null,
    patient_name:     document.getElementById('f_name').value,
    mobile:           document.getElementById('f_mobile').value,
    mode:             document.getElementById('f_mode').value,
    appointment_date: document.getElementById('f_appdate').value || null,
    timing:           document.getElementById('f_timing').value,
    doctor:           document.getElementById('f_doctor').value,
    request_for:      document.getElementById('f_request').value,
    comments:         document.getElementById('f_comment').value,
    status:           document.getElementById('f_status').value,
    attended_by:      document.getElementById('f_attended').value,
    handover_to:      document.getElementById('f_handover').value
  };

  let error;
  if (id) {
    ({ error } = await db.from('enquiries').update(record).eq('id', id));
  } else {
    ({ error } = await db.from('enquiries').insert([record]));
  }
  if (error) { alert('Save failed: ' + error.message); return; }
  closeForm();
  loadEnquiries();
}
