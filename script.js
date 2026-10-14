(function () {
  "use strict";

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var navList = document.getElementById("navList");
  menuBtn.addEventListener("click", function () {
    navList.classList.toggle("open");
  });
  navList.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { navList.classList.remove("open"); });
  });

  /* ---------- Filters (projects + skills) ---------- */
  function setupFilter(barId, itemSelector) {
    var bar = document.getElementById(barId);
    var items = document.querySelectorAll(itemSelector);
    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;
      bar.querySelectorAll(".filter").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      items.forEach(function (it) {
        var cats = (it.getAttribute("data-cat") || "").split(" ");
        it.classList.toggle("hide", f !== "all" && cats.indexOf(f) === -1);
      });
    });
  }
  setupFilter("projectFilters", "#projectGrid .card");
  setupFilter("skillFilters", "#skillGrid .skill");

  /* ---------- Counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1200;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor(p * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---------- Scroll reveal + counters ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var counters = document.querySelectorAll("[data-count]");
  var reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });

    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          animateCount(en.target);
          co.unobserve(en.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
    });
  }

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Cloud CLI ---------- */
  var term = document.getElementById("term");
  var out = document.getElementById("termOut");
  var input = document.getElementById("termInput");

  document.getElementById("termToggle").addEventListener("click", function () {
    term.classList.toggle("open");
    if (term.classList.contains("open")) input.focus();
  });
  document.getElementById("termClose").addEventListener("click", function () {
    term.classList.remove("open");
  });

  var commands = {
    help: function () {
      return [
        "Available commands:",
        "  whoami    - short intro",
        "  skills    - core technical skills",
        "  certs     - certifications",
        "  projects  - key projects",
        "  contact   - how to reach me",
        "  clear     - clear the screen"
      ].join("\n");
    },
    whoami: function () {
      return [
        "Shanavaz — Associate Technical Lead, Rapyder Cloud Solutions",
        "Bangalore, India · 11 years in cloud & IT infrastructure",
        "AWS · OCI · Terraform · Linux · Windows Server · JumpCloud"
      ].join("\n");
    },
    skills: function () {
      return [
        "AWS      : EC2, S3, RDS, VPC, ALB/ASG, Lambda, ECS, Route 53, CloudFront",
        "Security : IAM, KMS, WAF, Shield, SG/NACLs, JumpCloud SSO & MFA",
        "IaC/Ops  : Terraform, CloudWatch, Site24x7, ServiceNow",
        "Systems  : Linux, Windows Server, AD, Hyper-V, SAN, VDI"
      ].join("\n");
    },
    certs: function () {
      return [
        "[ok] AWS Certified SysOps Administrator - Associate",
        "[ok] AWS Certified Solutions Architect - Associate",
        "[ok] AWS Certified Security - Specialty",
        "[ok] Microsoft MCSA - Windows Server 2016",
        "[ok] JumpCloud Certified - Core"
      ].join("\n");
    },
    projects: function () {
      return [
        "- Biryani By Kilo : multi-account AWS, HA and fault-tolerant",
        "- Navi            : on-prem to AWS migration via Migration Hub",
        "- KSP             : 100 TB Huawei OceanStor + SAN + blade servers",
        "- KSRSAC          : Fujitsu servers, Hyper-V clustering, SAN",
        "- SHAR (ISRO)     : 250 Dell Wyse thin clients with VDI",
        "- Indian Air Force: Windows Server 2012 R2 on Fujitsu Primergy"
      ].join("\n");
    },
    contact: function () {
      return [
        "email  : abbashcne@gmail.com",
        "github : github.com/shanavaz-eng"
      ].join("\n");
    },
    clear: function () { out.textContent = ""; return null; }
  };

  function print(text) {
    out.textContent += (out.textContent ? "\n" : "") + text;
    out.scrollTop = out.scrollHeight;
  }

  function run(cmd) {
    var c = cmd.trim().toLowerCase();
    if (!c) return;
    if (c !== "clear") print("shanavaz@cloud:~$ " + c);
    if (commands.hasOwnProperty(c)) {
      var res = commands[c]();
      if (res) print(res);
    } else {
      print("command not found: " + c + ' (type "help")');
    }
  }

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      run(input.value);
      input.value = "";
    }
  });
  document.querySelectorAll(".term-chips button").forEach(function (b) {
    b.addEventListener("click", function () { run(b.getAttribute("data-cmd")); });
  });
})();
