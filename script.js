/* ==========================================================================
   Janine Grace Y. Plaga — Portfolio Interactivity
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menuToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileLinks = document.querySelectorAll(".mobile-link, .mobile-cta");
  const sections = document.querySelectorAll("main section[id]");

  // Footer year
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Portrait graceful fallback (keeps clean monogram frame if resume photo file is not yet placed)
  const portraitImg = document.getElementById("janinePortraitImg");
  const portraitFallback = document.getElementById("portraitFallback");

  if (portraitImg && portraitFallback) {
    const showFallback = () => {
      portraitImg.style.display = "none";
      portraitFallback.hidden = false;
    };

    portraitImg.addEventListener("error", showFallback);
    if (portraitImg.complete && portraitImg.naturalWidth === 0) {
      showFallback();
    }
  }

  // Soft particles drift around the portrait and react to pointer movement.
  const portraitStage = document.querySelector(".portrait-stage");
  const particleCanvas = document.getElementById("portraitParticles");
  const availabilityPulse = document.getElementById("availabilityPulse");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Follow the pointer with a soft violet cloud and glowing sparks.
  const customCursor = document.getElementById("customCursor");
  if (customCursor && !prefersReducedMotion) {
    document.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      customCursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      customCursor.classList.add("is-visible");
    }, { passive: true });

    document.addEventListener("pointerout", (event) => {
      if (event.relatedTarget === null) customCursor.classList.remove("is-visible");
    });
    window.addEventListener("blur", () => customCursor.classList.remove("is-visible"));
  }

  const cursorTrail = document.getElementById("cursorTrail");
  if (cursorTrail && !prefersReducedMotion) {
    const trailContext = cursorTrail.getContext("2d");
    if (trailContext) {
      const trailParticles = [];
      const cloudSprite = document.createElement("canvas");
      const spriteContext = cloudSprite.getContext("2d");
      let trailWidth = 0;
      let trailHeight = 0;
      let trailFrame = null;
      let previousPointer = null;
      let lastEmissionTime = 0;

      cloudSprite.width = 64;
      cloudSprite.height = 64;
      if (spriteContext) {
        const cloud = spriteContext.createRadialGradient(32, 32, 0, 32, 32, 32);
        cloud.addColorStop(0, "rgba(192, 132, 252, 0.28)");
        cloud.addColorStop(0.42, "rgba(168, 85, 247, 0.15)");
        cloud.addColorStop(1, "rgba(139, 92, 246, 0)");
        spriteContext.fillStyle = cloud;
        spriteContext.fillRect(0, 0, 64, 64);
      }

      const resizeTrail = () => {
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        trailWidth = window.innerWidth;
        trailHeight = window.innerHeight;
        cursorTrail.width = Math.round(trailWidth * pixelRatio);
        cursorTrail.height = Math.round(trailHeight * pixelRatio);
        trailContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      };

      const drawTrail = () => {
        trailContext.clearRect(0, 0, trailWidth, trailHeight);

        for (let i = trailParticles.length - 1; i >= 0; i -= 1) {
          const particle = trailParticles[i];
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life -= 1;

          if (particle.life <= 0) {
            trailParticles.splice(i, 1);
            continue;
          }

          const opacity = particle.life / particle.maxLife;
          if (particle.spark) {
            trailContext.globalAlpha = opacity;
            trailContext.beginPath();
            trailContext.arc(particle.x, particle.y, particle.radius * opacity, 0, Math.PI * 2);
            trailContext.fillStyle = "#f5d0fe";
            trailContext.fill();
          } else if (spriteContext) {
            const radius = particle.radius * (0.55 + opacity * 0.45);
            trailContext.globalAlpha = opacity;
            trailContext.drawImage(
              cloudSprite,
              particle.x - radius,
              particle.y - radius,
              radius * 2,
              radius * 2
            );
          }
        }

        trailContext.globalAlpha = 1;
        if (trailParticles.length > 0) {
          trailFrame = window.requestAnimationFrame(drawTrail);
        } else {
          trailFrame = null;
        }
      };

      document.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;
        if (event.timeStamp - lastEmissionTime < 16) return;
        lastEmissionTime = event.timeStamp;

        const dx = previousPointer ? event.clientX - previousPointer.x : 0;
        const dy = previousPointer ? event.clientY - previousPointer.y : 0;
        const distance = Math.hypot(dx, dy) || 1;
        const backX = -dx / distance;
        const backY = -dy / distance;
        previousPointer = { x: event.clientX, y: event.clientY };

        for (let i = 0; i < 1; i += 1) {
          trailParticles.push({
            x: event.clientX + backX * Math.random() * 24 + (Math.random() - 0.5) * 24,
            y: event.clientY + backY * Math.random() * 24 + (Math.random() - 0.5) * 24,
            vx: backX * 0.4 + (Math.random() - 0.5) * 0.7,
            vy: backY * 0.4 + (Math.random() - 0.5) * 0.7,
            radius: 24 + Math.random() * 36,
            life: 28 + Math.random() * 14,
            maxLife: 42,
            spark: false,
          });
        }

        if (Math.random() < 0.45) {
          trailParticles.push({
            x: event.clientX + (Math.random() - 0.5) * 38,
            y: event.clientY + (Math.random() - 0.5) * 38,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            radius: 1.5 + Math.random() * 1.5,
            life: 24 + Math.random() * 12,
            maxLife: 36,
            spark: true,
          });
        }

        if (trailParticles.length > 48) {
          trailParticles.splice(0, trailParticles.length - 48);
        }
        if (trailFrame === null) {
          trailFrame = window.requestAnimationFrame(drawTrail);
        }
      }, { passive: true });

      window.addEventListener("resize", resizeTrail);
      resizeTrail();
    }
  }

  if (portraitStage && particleCanvas) {
    const context = particleCanvas.getContext("2d");
    if (context) {
      const particleCount = 20;
      const particles = [];
      const pointer = { x: -1000, y: -1000, active: false };
      let canvasWidth = 0;
      let canvasHeight = 0;

      const resizeCanvas = () => {
        const bounds = portraitStage.getBoundingClientRect();
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvasWidth = bounds.width;
        canvasHeight = bounds.height;
        particleCanvas.width = Math.round(canvasWidth * pixelRatio);
        particleCanvas.height = Math.round(canvasHeight * pixelRatio);
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        if (particles.length === 0) {
          for (let i = 0; i < particleCount; i += 1) {
            particles.push({
              x: Math.random() * canvasWidth,
              y: Math.random() * canvasHeight,
              vx: (Math.random() - 0.5) * 0.35,
              vy: (Math.random() - 0.5) * 0.35,
              radius: 0.8 + Math.random() * 1.6,
              opacity: 0.35 + Math.random() * 0.55,
            });
          }
        } else {
          particles.forEach((particle) => {
            particle.x = Math.min(particle.x, canvasWidth);
            particle.y = Math.min(particle.y, canvasHeight);
          });
        }
      };

      const drawParticles = (animate) => {
        context.clearRect(0, 0, canvasWidth, canvasHeight);

        particles.forEach((particle) => {
          if (animate) {
            if (pointer.active) {
              const dx = particle.x - pointer.x;
              const dy = particle.y - pointer.y;
              const distance = Math.hypot(dx, dy);
              if (distance > 0 && distance < 150) {
                const force = (1 - distance / 150) * 0.08;
                particle.vx += (dx / distance) * force;
                particle.vy += (dy / distance) * force;
              }
            }

            particle.vx *= 0.99;
            particle.vy *= 0.99;
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0) particle.x = canvasWidth;
            if (particle.x > canvasWidth) particle.x = 0;
            if (particle.y < 0) particle.y = canvasHeight;
            if (particle.y > canvasHeight) particle.y = 0;
          }

          context.beginPath();
          context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          context.fillStyle = `rgba(210, 235, 255, ${particle.opacity})`;
          context.shadowColor = "#8b5cf6";
          context.shadowBlur = particle.radius * 4;
          context.fill();
        });

        context.shadowBlur = 0;
        if (animate) {
          window.requestAnimationFrame(() => drawParticles(true));
        }
      };

      const updateAvailabilityPulse = () => {
        if (!portraitImg || portraitImg.naturalWidth === 0) {
          availabilityPulse.hidden = true;
          return;
        }

        const imageBounds = portraitImg.getBoundingClientRect();
        const stageBounds = portraitStage.getBoundingClientRect();
        availabilityPulse.hidden = false;
        availabilityPulse.style.left = `${imageBounds.left - stageBounds.left + imageBounds.width * 0.08}px`;
        availabilityPulse.style.top = `${imageBounds.top - stageBounds.top + imageBounds.height * 0.921}px`;
      };

      portraitStage.addEventListener("pointermove", (event) => {
        const bounds = portraitStage.getBoundingClientRect();
        pointer.x = event.clientX - bounds.left;
        pointer.y = event.clientY - bounds.top;
        pointer.active = true;
        if (prefersReducedMotion) drawParticles(false);
      });

      portraitStage.addEventListener("pointerleave", () => {
        pointer.active = false;
      });

      window.addEventListener("resize", () => {
        resizeCanvas();
        updateAvailabilityPulse();
        if (prefersReducedMotion) drawParticles(false);
      });

      if (portraitImg) {
        portraitImg.addEventListener("load", updateAvailabilityPulse);
      }

      resizeCanvas();
      updateAvailabilityPulse();
      drawParticles(!prefersReducedMotion);
    }
  }

  // Sticky navbar shadow & scroll-spy active link
  const handleScroll = () => {
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 24);
    }

    const scrollPos = window.scrollY + 140;
    let activeId = "about";

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const target = link.getAttribute("href")?.replace("#", "");
      link.classList.toggle("active", target === activeId);
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Ease between sections when an in-page navigation link is selected.
  let sectionScrollFrame = null;
  const cancelSectionScroll = () => {
    if (sectionScrollFrame !== null) {
      window.cancelAnimationFrame(sectionScrollFrame);
      sectionScrollFrame = null;
      document.documentElement.classList.remove("is-scrolling-to-section");
    }
  };

  let sectionArrivalAnimations = [];
  const stopSectionArrival = () => {
    sectionArrivalAnimations.forEach((animation) => animation.cancel());
    sectionArrivalAnimations = [];
  };
  const playSectionArrival = (target) => {
    if (prefersReducedMotion) return;
    stopSectionArrival();
    sectionArrivalAnimations.push(target.animate(
      [{ opacity: 0.72 }, { opacity: 1 }],
      { duration: 860, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    ));

    const headingItems = target.querySelectorAll(
      ".section-header .section-eyebrow, .section-header .section-title, .section-header .section-subtitle"
    );
    headingItems.forEach((item, index) => {
      sectionArrivalAnimations.push(item.animate(
        [{ opacity: 0.12 }, { opacity: 1 }],
        {
          duration: 900,
          delay: index * 90,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)"
        }
      ));
    });
  };

  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      event.preventDefault();
      stopSectionArrival();
      cancelSectionScroll();
      history.pushState(null, "", link.getAttribute("href"));

      const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const startY = window.scrollY;
      const endY = Math.max(
        0,
        Math.min(
          target.getBoundingClientRect().top + startY - scrollPadding,
          document.documentElement.scrollHeight - window.innerHeight
        )
      );

      if (prefersReducedMotion || Math.abs(endY - startY) < 2) {
        window.scrollTo(0, endY);
        playSectionArrival(target);
        return;
      }

      const duration = Math.min(1000, Math.max(450, Math.abs(endY - startY) * 0.25));
      const startTime = performance.now();
      document.documentElement.classList.add("is-scrolling-to-section");

      const animateScroll = (time) => {
        const progress = Math.min((time - startTime) / duration, 1);
        const easedProgress = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        window.scrollTo(0, startY + (endY - startY) * easedProgress);

        if (progress < 1) {
          sectionScrollFrame = window.requestAnimationFrame(animateScroll);
        } else {
          sectionScrollFrame = null;
          document.documentElement.classList.remove("is-scrolling-to-section");
          playSectionArrival(target);
        }
      };

      sectionScrollFrame = window.requestAnimationFrame(animateScroll);
    });
  });

  window.addEventListener("wheel", cancelSectionScroll, { passive: true });
  window.addEventListener("touchstart", cancelSectionScroll, { passive: true });

  // Mobile navigation toggle
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileDrawer.classList.toggle("open");
      menuToggle.classList.toggle("open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      mobileDrawer.setAttribute("aria-hidden", String(!isOpen));
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileDrawer.classList.remove("open");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        mobileDrawer.setAttribute("aria-hidden", "true");
      });
    });
  }

  // Scroll Reveal Animations
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
    );

    revealItems.forEach((el) => revealObserver.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("visible"));
  }

  // Duplicate conveyor items seamlessly for continuous left-to-right loop
  const toolsTrack = document.getElementById("toolsTrack");
  if (toolsTrack) {
    const firstGroup = toolsTrack.querySelector(".tools-conveyor__group");
    if (firstGroup) {
      const cloneGroup = firstGroup.cloneNode(true);
      cloneGroup.setAttribute("aria-hidden", "true");
      cloneGroup.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible"));
      toolsTrack.appendChild(cloneGroup);
    }
  }

  // Apply pointer-driven 3D tilt to cards across the portfolio.
  const tiltCards = document.querySelectorAll(
    ".about__bio, .pillar-card, .service-card, .tool-card, .project-card, .education-card, .skills-card"
  );
  if (!prefersReducedMotion) {
    tiltCards.forEach((card) => {
      const logo = card.querySelector(".tool-card__logo");

      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const normX = x / rect.width - 0.5;
        const normY = y / rect.height - 0.5;

        const rotateY = normX * 10;
        const rotateX = -normY * 10;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
        card.style.transition = "transform 0.08s ease-out";
        card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;

        if (logo) {
          logo.style.transform = `translate3d(${(normX * 10).toFixed(1)}px, ${(normY * 10 - 5).toFixed(1)}px, 28px) scale(1.08)`;
        }
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
        card.style.transition = "";
        if (logo) {
          logo.style.transform = "";
        }
      });
    });
  }

  // Horizontal scroll controls for Work Samples
  const samplesTrack = document.getElementById("samplesTrack");
  const samplesPrev = document.getElementById("samplesPrev");
  const samplesNext = document.getElementById("samplesNext");

  if (samplesTrack) {
    let activePointerId = null;
    let dragStartX = 0;
    let startScrollLeft = 0;
    let didDrag = false;
    let suppressClick = false;

    samplesTrack.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      if (event.target.closest("a, button, input, textarea, select, [role='button']")) return;

      activePointerId = event.pointerId;
      dragStartX = event.clientX;
      startScrollLeft = samplesTrack.scrollLeft;
      didDrag = false;
      samplesTrack.setPointerCapture(event.pointerId);
    });

    samplesTrack.addEventListener("pointermove", (event) => {
      if (event.pointerId !== activePointerId) return;
      const distance = event.clientX - dragStartX;

      if (!didDrag) {
        if (Math.abs(distance) < 5) return;
        didDrag = true;
        samplesTrack.classList.add("is-dragging");
        customCursor?.classList.add("is-grabbing");
      }
      event.preventDefault();
      samplesTrack.scrollLeft = startScrollLeft - distance;
    });

    const finishDrag = (event) => {
      if (event.pointerId !== activePointerId) return;
      activePointerId = null;

      if (samplesTrack.hasPointerCapture(event.pointerId)) {
        samplesTrack.releasePointerCapture(event.pointerId);
      }

      if (didDrag) {
        suppressClick = true;
        window.setTimeout(() => {
          suppressClick = false;
        }, 0);
      }
      didDrag = false;
      samplesTrack.classList.remove("is-dragging");
      customCursor?.classList.remove("is-grabbing");
    };

    samplesTrack.addEventListener("pointerup", finishDrag);
    samplesTrack.addEventListener("pointercancel", finishDrag);
    samplesTrack.addEventListener("click", (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }, true);
  }

  if (samplesTrack && samplesPrev && samplesNext) {
    const getScrollStep = () => Math.min(380, samplesTrack.clientWidth * 0.85);
    samplesPrev.addEventListener("click", () => {
      samplesTrack.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
    });
    samplesNext.addEventListener("click", () => {
      samplesTrack.scrollBy({ left: getScrollStep(), behavior: "smooth" });
    });
  }

  // Work Sample Modal
  const projectSamples = {
    "inquiry-doc": {
      title: "Customer Inquiry Documentation",
      badge: "Work Sample • Personal Demo",
      html: `
        <p>A personal demonstration template showing how customer inquiries are logged cleanly for accurate case continuity.</p>
        <div class="sample-box">
          <h4>Sample Interaction Summary Fields</h4>
          <ul>
            <li><strong>Interaction Channel:</strong> Inbound Phone / Written Portal Inquiry</li>
            <li><strong>Verification Status:</strong> Two-point caller verification completed per privacy guidelines</li>
            <li><strong>Inquiry Summary:</strong> Member requested clarification on coverage status and participating provider contact info</li>
            <li><strong>Systems Checked:</strong> Customer Connect, Benefits Viewer, National Directory</li>
            <li><strong>Action Taken &amp; Outcome:</strong> Explained basic plan details, shared verified provider info, updated record notes</li>
          </ul>
        </div>
      `,
    },
    "insurance-workflow": {
      title: "Healthcare Insurance Verification Workflow",
      badge: "Work Sample • Personal Demo",
      html: `
        <p>A practice workflow illustrating sequential checks used when assisting with basic health insurance inquiries.</p>
        <div class="sample-box">
          <h4>Verification Checklist Steps</h4>
          <ul>
            <li><strong>Step 1 — Identity &amp; Privacy Check:</strong> Confirm caller identity before accessing policy or claim records.</li>
            <li><strong>Step 2 — Policy &amp; Eligibility Review:</strong> Verify active status and plan summary via Benefits Viewer or Availity.</li>
            <li><strong>Step 3 — Provider Confirmation:</strong> Confirm network listing or NPI details via Provider Connect / NPI Registry.</li>
            <li><strong>Step 4 — Clear Member Explanation:</strong> Communicate findings in plain, courteous language and document the call.</li>
          </ul>
        </div>
      `,
    },
    "email-responses": {
      title: "Sample Customer Service Email Responses",
      badge: "Work Sample • Personal Demo",
      html: `
        <p>Sample non-voice response template designed to maintain warmth, clarity, and data privacy in written support.</p>
        <div class="sample-box">
          <h4>Sample Follow-Up Response</h4>
          <p><em>&ldquo;Thank you for reaching out regarding your healthcare coverage inquiry. After reviewing your account details, your active plan information has been confirmed. For your security, full plan specifics are available inside your member portal, and we are happy to assist if you have any follow-up questions.&rdquo;</em></p>
        </div>
      `,
    },
    "process-doc": {
      title: "Healthcare Support Process Documentation",
      badge: "Work Sample • Personal Demo",
      html: `
        <p>Practice standard operating guide mapping communication procedures from greeting to wrap-up.</p>
        <div class="sample-box">
          <h4>Core Process Stages</h4>
          <ul>
            <li><strong>Greeting &amp; Active Listening:</strong> Warm opening, empathetic acknowledgment, and clarifying questions.</li>
            <li><strong>Information Retrieval:</strong> Cross-checking relevant portals accurately without rushing the member.</li>
            <li><strong>Confidential Handling:</strong> Avoiding unnecessary exposure of sensitive health details.</li>
            <li><strong>Closing &amp; Documentation:</strong> Confirming resolution and logging clear, concise notes.</li>
          </ul>
        </div>
      `,
    },
    "data-management": {
      title: "Data Entry and Record Management",
      badge: "Work Sample • Personal Demo",
      html: `
        <p>A practice record hygiene structure showing consistent formatting for contact logs and status updates.</p>
        <div class="sample-box">
          <h4>Record Accuracy Standards</h4>
          <ul>
            <li>Consistent date formatting, case category tags, and verified reference IDs.</li>
            <li>Double-checking spelling of member names, provider titles, and contact numbers before saving.</li>
            <li>Flagging incomplete requests clearly for timely follow-up.</li>
          </ul>
        </div>
      `,
    },
    "interaction-reports": {
      title: "Sample Customer Interaction Reports",
      badge: "Work Sample • Personal Demo",
      html: `
        <p>A personal demonstration log summarizing daily support categories and resolution status without exposing private data.</p>
        <div class="sample-box">
          <h4>Sample Report Breakdown</h4>
          <ul>
            <li><strong>Benefit &amp; Eligibility Questions:</strong> Logged, explained, and marked resolved.</li>
            <li><strong>Provider Directory Lookups:</strong> Verified via National Directory / NPI Registry.</li>
            <li><strong>Written Follow-Ups:</strong> Tracked for timely response within quality standards.</li>
          </ul>
        </div>
      `,
    },
  };

  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBadge = document.getElementById("modalBadge");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  };

  document.querySelectorAll(".project-card__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sample = projectSamples[btn.dataset.project];
      if (!sample || !modal || !modalTitle || !modalBadge || !modalBody) return;

      modalTitle.textContent = sample.title;
      modalBadge.textContent = sample.badge;
      modalBody.innerHTML = sample.html;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  // Contact Form Handling (opens user's mail client with pre-filled details + displays feedback)
  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");

  if (contactForm && formFeedback) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("senderName").value.trim();
      const email = document.getElementById("senderEmail").value.trim();
      const topic = document.getElementById("inquiryTopic").value;
      const message = document.getElementById("senderMessage").value.trim();

      if (!name || !email || !message) {
        formFeedback.textContent = "Please fill in your name, email address, and message.";
        formFeedback.classList.add("error");
        return;
      }

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailValid) {
        formFeedback.textContent = "Please enter a valid email address.";
        formFeedback.classList.add("error");
        return;
      }

      formFeedback.classList.remove("error");
      formFeedback.textContent = "Opening your email client to send your message to Janine...";

      const subject = encodeURIComponent(`[Portfolio Inquiry] ${topic} - from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`);
      window.location.href = `mailto:janinegraceplaga21@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});
