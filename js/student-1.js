// Student 1: completed contribution. Branch: student-1.

Hospital.register("overview", (root) => {
  const H = Hospital,
    s = H.state,
    rows = s.appointments
      .filter((a) => a.date === H.today())
      .sort((a, b) => a.time.localeCompare(b.time));
  root.innerHTML =
    H.heading(
      "A little care. A better day.",
      "Here is what is happening at your hospital today.",
    ) +
    `
 <section class="hero d-flex justify-content-between align-items-center gap-3"><div><div class="eyebrow mb-2">PATIENT CARE, SIMPLIFIED</div><h2>Every appointment is a connection.</h2><p class="mb-0">Keep your day moving with appointments, patient records, and your care team in one place.</p></div><button id="new-booking" class="btn btn-primary text-nowrap">+ Book appointment</button></section>
 <div class="row g-3 mb-4">${[
   [
     "Today's appointments",
     rows.filter((a) => a.status !== "Cancelled").length,
     "Scheduled for today",
     "▤",
   ],
   ["Registered patients", s.patients.length, "Your patient directory", "♧"],
   ["Available doctors", s.doctors.length, "Across 4 departments", "✚"],
   [
     "Waiting patients",
     rows.filter((a) => a.status === "Checked in").length,
     "Ready for consultation",
     "◷",
   ],
 ]
   .map(
     ([label, n, sub, icon]) =>
       `<div class="col-6 col-xl-3"><div class="panel metric"><div class="d-flex justify-content-between align-items-center"><span class="muted">${label}</span><span class="metric-icon">${icon}</span></div><div class="metric-value">${n}</div><small>${sub}</small></div></div>`,
   )
   .join("")}</div>
 <div class="row g-4"><div class="col-xl-8"><section class="panel"><div class="section-head"><h2 class="mb-0">Today's appointments</h2><button id="view-all" class="btn btn-sm btn-light">View all →</button></div>${H.table(rows)}</section></div><div class="col-xl-4"><section class="panel mb-4"><h2 class="mb-4">Care team</h2>${s.doctors
   .slice(0, 3)
   .map(
     (d) =>
       `<div class="d-flex align-items-center gap-3 mb-3"><span class="avatar">${d.initials}</span><div><strong>${H.esc(d.name)}</strong><small>${H.esc(d.department)}</small></div></div>`,
   )
   .join(
     "",
   )}<button id="team" class="btn btn-light w-100">Explore doctors →</button></section><section class="panel"><h2 class="mb-4">Today's pulse</h2><div class="activity"><strong>${rows.filter((a) => a.status === "Completed").length} consultations completed</strong><small>Updated from appointment status</small></div><div class="activity"><strong>${rows.filter((a) => a.status === "Confirmed").length} appointments expected</strong><small>Confirmed bookings for today</small></div></section></div></div>`;
  root.querySelector("#new-booking").onclick = () => H.go("booking");
  root.querySelector("#view-all").onclick = () => H.go("appointments");
  root.querySelector("#team").onclick = () => H.go("doctors");
});



Hospital.register("reports", (root) => {
  const H = Hospital,
    s = H.state,
    total = s.appointments.length,
    completed = s.appointments.filter((a) => a.status === "Completed"),
    fees = completed.reduce(
      (sum, a) => sum + s.doctors.find((d) => d.id === a.doctor).fee,
      0,
    );
  root.innerHTML =
    H.heading(
      "Care in perspective",
      "A simple view of appointments across all dates.",
    ) +
    `<div class="row g-4 mb-4">${[
      ["Total appointments", total],
      ["Completed visits", completed.length],
      ["Completed consultation value", H.money(fees)],
    ]
      .map(
        ([l, n]) =>
          `<div class="col-md-4"><section class="panel"><span class="muted">${l}</span><div class="metric-value">${n}</div></section></div>`,
      )
      .join(
        "",
      )}</div><div class="row g-4"><div class="col-lg-7"><section class="panel"><h2 class="mb-4">Appointments by department</h2>${s.doctors
      .map((d) => {
        const n = s.appointments.filter((a) => a.doctor === d.id).length;
        return `<div class="mb-4"><div class="d-flex justify-content-between mb-2"><span>${H.esc(d.department)}</span><strong>${n}</strong></div><div class="bar"><div style="width:${total ? (n / total) * 100 : 0}%"></div></div></div>`;
      })
      .join(
        "",
      )}</section></div><div class="col-lg-5"><section class="panel"><h2 class="mb-4">Appointment status</h2>${["Confirmed", "Checked in", "Completed", "Cancelled"].map((status) => `<div class="d-flex justify-content-between border-bottom py-3">${H.badge(status)}<strong>${s.appointments.filter((a) => a.status === status).length}</strong></div>`).join("")}<button id="export" class="btn btn-primary w-100 mt-4">Download appointment CSV</button><small class="mt-3">Consultation value is a demo estimate, not a payment record.</small></section></div></div>`;
  root.querySelector("#export").onclick = () => {
    const cell = (v) =>
      '"' +
      String(v)
        .replace(/^[=+@-]/, "'$&")
        .replace(/"/g, '""') +
      '"';
    const rows = [
      ["Patient", "Doctor", "Date", "Time", "Status"],
      ...s.appointments.map((a) => [
        H.patient(a.patient),
        H.doctor(a.doctor),
        a.date,
        a.time,
        a.status,
      ]),
    ];
    const blob = new Blob(
        ["\uFEFF" + rows.map((r) => r.map(cell).join(",")).join("\r\n")],
        { type: "text/csv;charset=utf-8;" },
      ),
      url = URL.createObjectURL(blob),
      link = document.createElement("a");
    link.href = url;
    link.download = "adk-appointments.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
});
