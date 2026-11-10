/* Shared foundation. Student 1 creates this before feature branches. */
window.Hospital = (() => {
  const today = () => new Date().toLocaleDateString("en-CA");
  const seed = () => ({
    doctors: [
      {
        id: "d1",
        name: "Dr. Aisha Hassan",
        department: "General medicine",
        fee: 350,
        initials: "AH",
      },
      {
        id: "d2",
        name: "Dr. Ahmed Ali",
        department: "Cardiology",
        fee: 550,
        initials: "AA",
      },
      {
        id: "d3",
        name: "Dr. Mariyam Adam",
        department: "Paediatrics",
        fee: 400,
        initials: "MA",
      },
      {
        id: "d4",
        name: "Dr. Ibrahim Saeed",
        department: "Orthopaedics",
        fee: 500,
        initials: "IS",
      },
    ],
    patients: [
      { id: "p1", name: "Sara Ahmed", phone: "7771234" },
      { id: "p2", name: "Ali Mohamed", phone: "7772345" },
      { id: "p3", name: "Hana Ibrahim", phone: "7773456" },
    ],
    appointments: [
      {
        id: "a1",
        patient: "p1",
        doctor: "d1",
        date: today(),
        time: "09:00",
        status: "Confirmed",
      },
      {
        id: "a2",
        patient: "p2",
        doctor: "d2",
        date: today(),
        time: "10:30",
        status: "Checked in",
      },
      {
        id: "a3",
        patient: "p3",
        doctor: "d3",
        date: today(),
        time: "11:00",
        status: "Confirmed",
      },
    ],
  });
  let state;
  try {
    state = JSON.parse(localStorage.getItem("adk-class-v1"));
  } catch {}
  if (
    !state ||
    !Array.isArray(state.patients) ||
    !Array.isArray(state.appointments) ||
    !Array.isArray(state.doctors)
  )
    state = seed();
  const pages = {};
  let current = "overview";
  const esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const patient = (id) =>
    state.patients.find((p) => p.id === id)?.name || "Unknown";
  const doctor = (id) =>
    state.doctors.find((d) => d.id === id)?.name || "Unknown";
  const badge = (s) =>
    `<span class="status ${s === "Cancelled" ? "cancel" : s === "Completed" ? "done" : ""}">${esc(s)}</span>`;
  const active = (a) => !["Cancelled", "Completed"].includes(a.status);
  const money = (n) => "MVR " + Number(n).toLocaleString();
  function notify(message) {
    const el = document.getElementById("notice");
    el.textContent = message;
    el.hidden = false;
    setTimeout(() => (el.hidden = true), 4000);
  }
  function save() {
    try {
      localStorage.setItem("adk-class-v1", JSON.stringify(state));
    } catch {
      notify(
        "Browser storage is unavailable. Changes last for this session only.",
      );
    }
  }
  function go(page) {
    current = page;
    document.querySelectorAll("[data-page]").forEach((b) => {
      b.classList.toggle("selected", b.dataset.page === page);
      b.setAttribute(
        "aria-current",
        b.dataset.page === page ? "page" : "false",
      );
    });
    const names = {
      overview: "Overview",
      doctors: "Doctors",
      patients: "Patients",
      booking: "Book appointment",
      appointments: "Appointments",
      queue: "Check-in queue",
      reports: "Reports",
    };
    document.getElementById("page-name").textContent = names[page];
    pages[page]?.(document.getElementById("view"));
  }
  function table(rows, actions = false) {
    return `<div class="table-responsive"><table class="table align-middle"><thead><tr><th>Patient</th><th>Doctor</th><th>Date & time</th><th>Status</th>${actions ? "<th>Action</th>" : ""}</tr></thead><tbody>${rows.length ? rows.map((a) => `<tr><td><strong>${esc(patient(a.patient))}</strong><small>${esc(a.id.slice(0, 8))}</small></td><td>${esc(doctor(a.doctor))}</td><td>${esc(a.date)}<small>${esc(a.time)}</small></td><td>${badge(a.status)}</td>${actions ? `<td><button class="btn btn-sm btn-light" data-edit="${esc(a.id)}">Manage</button></td>` : ""}</tr>`).join("") : `<tr><td colspan="5" class="text-center py-5 text-secondary">No appointments found.</td></tr>`}</tbody></table></div>`;
  }
  const style = document.createElement("style");
  style.textContent = `
  :root{--ink:#193447;--blue:#184990;--muted:#71818e;--line:#e6ecf1}body{background:#f5f7fa;color:var(--ink);font-family:Inter,Arial,sans-serif;font-size:14px}button,input,select{font:inherit}h1{font-size:29px;font-weight:700;letter-spacing:-.8px}h2{font-size:18px;font-weight:700}h3{font-size:16px;font-weight:700}.sidebar{width:235px;background:white;border-right:1px solid var(--line);position:fixed;inset:0 auto 0 0;padding:34px 22px;display:flex;flex-direction:column}.logo{width:164px;height:auto;margin-bottom:38px}.nav-label{font-size:10px;letter-spacing:1.7px;color:#8a99a6;margin:0 12px 12px}.nav-item{border:0;background:none;text-align:left;width:100%;padding:13px 14px;border-radius:8px;color:#71818e;margin-bottom:5px;display:flex;gap:12px;align-items:center}.nav-item.selected{background:#edf3fb;color:var(--blue);font-weight:700}.nav-item:hover{background:#f0f4f8}.nav-icon{font-size:17px;width:22px;text-align:center}.side-foot{margin-top:auto;padding:18px 10px;border-top:1px solid var(--line);font-size:12px;color:var(--muted)}.main{margin-left:235px}.topbar{background:white;min-height:78px;border-bottom:1px solid var(--line);padding:20px 38px;display:flex;align-items:center;justify-content:space-between}.breadcrumb-text{color:#8795a0;font-size:12px}.workspace{max-width:1460px;padding:35px 38px;margin:auto}.eyebrow{color:var(--blue);font-size:10px;letter-spacing:1.5px;font-weight:700}.muted{color:var(--muted)}.panel{background:white;border:1px solid var(--line);border-radius:12px;padding:24px}.metric{min-height:146px}.metric-value{font-size:34px;font-weight:700;letter-spacing:-1px;margin:12px 0 3px}.metric-icon{background:#edf3fb;color:var(--blue);padding:8px 11px;border-radius:8px}.btn-primary{background:var(--blue);border-color:var(--blue)}.btn{border-radius:7px;padding:10px 16px;font-size:13px}.table{font-size:13px;margin:0}.table th{font-size:10px;letter-spacing:.8px;color:#82909d;text-transform:uppercase;background:#f8fafc;border-bottom:1px solid var(--line);padding:14px 12px}.table td{padding:17px 12px;border-color:#f0f3f6}small{display:block;font-size:11px;color:var(--muted);margin-top:4px}.status{display:inline-block;padding:5px 9px;border-radius:5px;background:#eaf4ef;color:#35826a;font-size:11px;white-space:nowrap}.status.cancel{background:#fceeee;color:#b55757}.status.done{background:#edf1f7;color:#60738d}.avatar{width:46px;height:46px;border-radius:50%;background:#eaf0f9;color:var(--blue);display:inline-flex;align-items:center;justify-content:center;font-weight:700}.hero{background:#edf3fb;border:1px solid #e0e9f6;border-radius:12px;padding:27px 30px;margin-bottom:26px}.hero p{max-width:470px;color:#687e96}.form-label{font-size:12px;font-weight:600}.form-control,.form-select{padding:11px;border-color:#dfe7ee;font-size:14px}.notice{position:fixed;bottom:24px;right:24px;background:#193447;color:white;padding:15px 24px;border-radius:9px;z-index:1080;max-width:90vw}.bar{height:8px;background:#edf1f6;border-radius:20px;overflow:hidden}.bar>div{height:100%;background:#527db3;border-radius:20px}.date-pill{background:white;border:1px solid var(--line);padding:9px 14px;border-radius:7px;color:#607487}.section-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:22px}.demo{color:#80909f;font-size:11px}.activity{border-left:2px solid #e4ebf3;padding:0 0 22px 18px;margin-left:5px}.activity:last-child{padding-bottom:0}.feature-empty{text-align:center;padding:60px 20px;color:var(--muted)}:focus-visible{outline:3px solid #70a1e1;outline-offset:3px}
  @media(max-width:900px){.sidebar{width:190px;padding:24px 12px}.main{margin-left:190px}.workspace{padding:25px 20px}.topbar{padding:18px 20px}.logo{width:150px}}@media(max-width:640px){.sidebar{position:static;width:100%;padding:18px}.logo{width:125px;margin:0 0 18px}.nav-list{display:flex;overflow:auto;gap:5px}.nav-item{width:auto;white-space:nowrap;padding:9px}.nav-icon,.nav-label,.side-foot{display:none}.main{margin-left:0}.topbar{min-height:60px}.workspace{padding:22px 16px}.panel{padding:18px}h1{font-size:25px}.hero{padding:22px;flex-wrap:wrap}.date-pill{font-size:11px}.section-head{flex-wrap:wrap}}`;
  document.head.append(style);
  document.getElementById("app").innerHTML =
    `<aside class="sidebar"><img class="logo" src="assets/adkLogo.svg" alt="ADK Hospital"><div class="nav-label">WORKSPACE</div><nav class="nav-list" aria-label="Main navigation">${[
      ["overview", "Overview", "▦"],
      ["appointments", "Appointments", "▤"],
      ["booking", "Book appointment", "+"],
      ["patients", "Patients", "♧"],
      ["doctors", "Doctors", "✚"],
      ["queue", "Check-in queue", "◷"],
      ["reports", "Reports", "▥"],
    ]
      .map(
        ([id, label, icon]) =>
          `<button class="nav-item" data-page="${id}"><span class="nav-icon" aria-hidden="true">${icon}</span>${label}</button>`,
      )
      .join(
        "",
      )}</nav><div class="side-foot"><strong>Care, connected.</strong><br>Hospital booking workspace<br><br><span class="demo">Classroom demo • Fictional records</span></div></aside><div class="main"><header class="topbar"><div><span class="breadcrumb-text">Workspace / </span><strong id="page-name">Overview</strong></div><div class="d-flex align-items-center gap-3"><span class="muted">Reception desk</span><span class="avatar" style="width:34px;height:34px;font-size:11px">AD</span></div></header><main class="workspace" id="view"></main></div><div id="notice" class="notice" role="status" hidden></div>`;
  document
    .querySelectorAll("[data-page]")
    .forEach((b) => (b.onclick = () => go(b.dataset.page)));
  return {
    state,
    today,
    esc,
    patient,
    doctor,
    badge,
    active,
    money,
    save,
    notify,
    go,
    table,
    register: (name, render) => {
      pages[name] = render;
    },
    heading: (title, sub) =>
      `<div class="section-head"><div><h1>${title}</h1><p class="muted mb-0">${sub}</p></div><span class="date-pill">${new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span></div>`,
  };
})();
window.addEventListener("DOMContentLoaded", () => Hospital.go("overview"));
