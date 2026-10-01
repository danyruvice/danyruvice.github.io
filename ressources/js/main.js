/* Portfolio - Dany Ruvice Nguimtsop Mekouzou */

(function () {
	"use strict";

	var navHeight = 56;

	/* ---------------------------------------------------------------- Loader */

	function hideLoader() {
		var loader = document.getElementById("loader");
		document.body.classList.remove("overflow-hidden");
		if (!loader) {
			return;
		}
		loader.classList.add("loader-done");
		window.setTimeout(function () {
			loader.remove();
		}, 800);
	}

	window.addEventListener("load", function () {
		window.setTimeout(hideLoader, 1600);
	});
	// Filet de sécurité si une ressource externe ne répond pas.
	window.setTimeout(hideLoader, 5000);

	/* --------------------------------------------------- Navigation fluide */

	function scrollToTarget(selector) {
		var target = document.querySelector(selector);
		if (!target) {
			return;
		}
		var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
		window.scrollTo({ top: top, behavior: "smooth" });
	}

	document.querySelectorAll("[data-nw-href]").forEach(function (link) {
		link.addEventListener("click", function () {
			scrollToTarget(link.dataset.nwHref);

			var collapse = document.getElementById("navbarSupportedContent");
			if (collapse && collapse.classList.contains("show") && window.bootstrap) {
				window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
			}
		});
	});

	/* ------------------------------------------------- Lien actif du menu */

	var navLinks = Array.prototype.slice.call(
		document.querySelectorAll(".navbar-nav [data-nw-href]")
	);

	function updateActiveLink() {
		var current = null;
		navLinks.forEach(function (link) {
			var section = document.querySelector(link.dataset.nwHref);
			if (section && section.getBoundingClientRect().top - navHeight - 80 <= 0) {
				current = link;
			}
		});
		navLinks.forEach(function (link) {
			link.classList.toggle("nav-active", link === current);
		});
	}

	/* ------------------------------------------------------------ Onglets */

	document.querySelectorAll(".js_show_btn").forEach(function (btn) {
		btn.addEventListener("click", function () {
			var group = btn.dataset.nwClassgroup;
			var targetId = btn.dataset.nwIdTarget;

			document.querySelectorAll("." + group).forEach(function (panel) {
				panel.classList.toggle("hidden", panel.id !== targetId);
			});

			document
				.querySelectorAll('.js_show_btn[data-nw-classgroup="' + group + '"]')
				.forEach(function (other) {
					other.classList.toggle("selected_btn", other === btn);
				});
		});
	});

	/* ----------------------------------------- Apparition au défilement */

	function revealOnScroll() {
		document.querySelectorAll(".fade-in-out").forEach(function (el) {
			var box = el.getBoundingClientRect();
			if (box.top < window.innerHeight - 90 && box.bottom > 0) {
				el.classList.add("fade-in-out-displayed");
			}
		});
	}

	/* ------------------------------------------------- Boucle de défilement */

	var scheduled = false;

	function onScroll() {
		if (scheduled) {
			return;
		}
		scheduled = true;
		window.requestAnimationFrame(function () {
			updateActiveLink();
			revealOnScroll();
			scheduled = false;
		});
	}

	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onScroll);
	onScroll();

	/* ------------------------------------------- Cartes : pivot au toucher */

	if (window.matchMedia("(hover: none)").matches) {
		document.querySelectorAll(".portfolioCard-content").forEach(function (card) {
			card.addEventListener("click", function (event) {
				if (event.target.hasAttribute("data-zoom") && card.classList.contains("flipped")) {
					return;
				}
				card.classList.toggle("flipped");
			});
		});
	}

	/* ------------------------------------------------ Visionneuse d'images */

	var lightbox = document.getElementById("lightbox");
	var lightboxImg = document.getElementById("lightbox_img");

	function closeLightbox() {
		lightbox.classList.add("hidden");
		lightboxImg.src = "";
	}

	document.querySelectorAll("[data-zoom]").forEach(function (img) {
		img.addEventListener("click", function (event) {
			event.stopPropagation();
			lightboxImg.src = img.src;
			lightboxImg.alt = img.alt;
			lightbox.classList.remove("hidden");
		});
	});

	if (lightbox) {
		lightbox.addEventListener("click", closeLightbox);
		document.addEventListener("keydown", function (event) {
			if (event.key === "Escape" && !lightbox.classList.contains("hidden")) {
				closeLightbox();
			}
		});
	}

	/* -------------------------------------------------- Formulaire courriel */

	var form = document.getElementById("contact_form");

	if (form) {
		form.addEventListener("submit", function (event) {
			event.preventDefault();

			var success = document.getElementById("mail_statut_success");
			var error = document.getElementById("mail_statut_error");
			var email = document.getElementById("email").value.trim();
			var object = document.getElementById("object").value.trim();
			var msg = document.getElementById("msg").value.trim();

			if (!form.checkValidity() || !email || !object || !msg) {
				error.classList.remove("hidden");
				success.classList.add("hidden");
				return;
			}

			var body = msg + "\n\n--\nCourriel de contact : " + email;
			window.location.href =
				"mailto:danynguimtsop@gmail.com?subject=" +
				encodeURIComponent(object) +
				"&body=" +
				encodeURIComponent(body);

			error.classList.add("hidden");
			success.classList.remove("hidden");
		});
	}

	/* -------------------------------------------------------------- Divers */

	var year = document.getElementById("footer_year");
	if (year) {
		year.textContent = new Date().getFullYear();
	}
})();
