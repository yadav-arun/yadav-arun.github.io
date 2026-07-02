/* ============================================================
   Arun Yadav — Portfolio interactions
   Vanilla JS, no dependencies.
   ============================================================ */

(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    /* ---------- Navigation: scrolled state, hide-on-scroll, back-to-top ---------- */

    const nav = $('#nav');
    const toTop = $('#to-top');
    let lastY = window.scrollY;

    const onScroll = () => {
        const y = window.scrollY;
        nav.classList.toggle('is-scrolled', y > 24);
        if (!document.body.classList.contains('menu-open')) {
            if (y > 160 && y - lastY > 6) nav.classList.add('is-hidden');
            else if (lastY - y > 6 || y < 160) nav.classList.remove('is-hidden');
        }
        lastY = y;
        toTop.classList.toggle('show', y > 600);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    /* ---------- Mobile menu ---------- */

    const navToggle = $('#nav-toggle');
    const navLinks = $('#nav-links');

    const setMenu = (open) => {
        document.body.classList.toggle('menu-open', open);
        navToggle.setAttribute('aria-expanded', String(open));
    };

    navToggle.addEventListener('click', () => {
        setMenu(!document.body.classList.contains('menu-open'));
    });

    $$('a', navLinks).forEach((link) => {
        link.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenu(false);
    });

    /* ---------- Active section highlighting ---------- */

    const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const link = $(`.nav-link[href="#${entry.target.id}"]`);
            if (!link) return;
            $$('.nav-link').forEach((l) => l.classList.remove('is-active'));
            link.classList.add('is-active');
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    $$('main section[id]').forEach((section) => spy.observe(section));

    /* ---------- Scroll reveals ---------- */

    const revealEls = $$('[data-reveal]');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach((el) => el.classList.add('in-view'));
    } else {
        const revealer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('in-view');
                revealer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        revealEls.forEach((el) => revealer.observe(el));
    }

    /* ---------- Animated counters ---------- */

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const counter = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            counter.unobserve(entry.target);
            const el = entry.target;
            const target = Number(el.dataset.count);
            if (reduceMotion) {
                el.textContent = target;
                return;
            }
            const start = performance.now();
            const duration = 1400;
            const tick = (now) => {
                const p = Math.min((now - start) / duration, 1);
                el.textContent = Math.round(easeOutCubic(p) * target);
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    }, { threshold: 0.6 });

    $$('[data-count]').forEach((el) => counter.observe(el));

    /* ---------- Typewriter roles ---------- */

    const typewriter = $('#typewriter');
    if (typewriter && !reduceMotion) {
        const roles = ['Full Stack Developer', 'Philomath', 'Gallivanter'];
        let roleIndex = 0;
        let charIndex = roles[0].length;
        let deleting = true;

        const step = () => {
            const word = roles[roleIndex];
            charIndex += deleting ? -1 : 1;
            typewriter.textContent = word.slice(0, charIndex);
            let delay = deleting ? 42 : 82;
            if (!deleting && charIndex === word.length) {
                deleting = true;
                delay = 2300;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                delay = 420;
            }
            setTimeout(step, delay);
        };
        setTimeout(step, 2600);
    }

    /* ---------- Custom cursor (fine pointers only) ---------- */

    if (finePointer && !reduceMotion) {
        const dot = $('#cursor-dot');
        const ring = $('#cursor-ring');
        document.body.classList.add('has-cursor');

        let mx = window.innerWidth / 2;
        let my = window.innerHeight / 2;
        let rx = mx;
        let ry = my;
        let shown = false;

        window.addEventListener('pointermove', (e) => {
            mx = e.clientX;
            my = e.clientY;
            if (!shown) {
                shown = true;
                rx = mx;
                ry = my;
                document.body.classList.add('cursor-visible');
            }
            dot.style.transform = `translate(${mx}px, ${my}px)`;
        }, { passive: true });

        const follow = () => {
            rx += (mx - rx) * 0.16;
            ry += (my - ry) * 0.16;
            ring.style.transform = `translate(${rx}px, ${ry}px)`;
            requestAnimationFrame(follow);
        };
        requestAnimationFrame(follow);

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button')) ring.classList.add('is-active');
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button')) ring.classList.remove('is-active');
        });
        document.documentElement.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-visible');
        });
        document.documentElement.addEventListener('mouseenter', () => {
            if (shown) document.body.classList.add('cursor-visible');
        });
    }

    /* ---------- Magnetic buttons ---------- */

    if (finePointer && !reduceMotion) {
        $$('.btn, .nav-cta').forEach((el) => {
            el.addEventListener('pointermove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.18;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.24;
                el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
            });
            el.addEventListener('pointerleave', () => {
                el.style.transform = '';
            });
        });
    }

    /* ---------- Project list: accordion ---------- */

    const plist = $('.plist');
    const preview = $('.plist-preview');
    const previewImg = preview ? $('img', preview) : null;

    const hidePreview = () => {
        if (preview) preview.classList.remove('show');
    };

    if (plist) {
        $$('.plist-item', plist).forEach((item) => {
            const head = $('.plist-head', item);
            head.addEventListener('click', () => {
                const wasOpen = item.classList.contains('open');
                $$('.plist-item.open', plist).forEach((open) => {
                    open.classList.remove('open');
                    $('.plist-head', open).setAttribute('aria-expanded', 'false');
                });
                if (!wasOpen) {
                    item.classList.add('open');
                    head.setAttribute('aria-expanded', 'true');
                }
                hidePreview();
            });
        });
    }

    /* ---------- Project list: floating image preview ---------- */

    if (plist && preview && finePointer && !reduceMotion) {
        let targetX = 0;
        let targetY = 0;
        let x = 0;
        let y = 0;
        let tilt = 0;
        let tracking = false;

        const glide = () => {
            x += (targetX - x) * 0.16;
            y += (targetY - y) * 0.16;
            const lean = Math.max(-9, Math.min(9, (targetX - x) * 0.08));
            tilt += (lean - tilt) * 0.12;
            preview.style.transform =
                `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -58%) rotate(${tilt.toFixed(2)}deg)`;
            requestAnimationFrame(glide);
        };

        plist.addEventListener('pointermove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            if (!tracking) {
                tracking = true;
                x = targetX;
                y = targetY;
                requestAnimationFrame(glide);
            }
        }, { passive: true });

        plist.addEventListener('pointerover', (e) => {
            const head = e.target.closest('.plist-head');
            if (!head) {
                hidePreview();
                return;
            }
            const item = head.closest('.plist-item');
            if (item.classList.contains('open')) {
                hidePreview();
                return;
            }
            previewImg.src = item.dataset.img;
            preview.classList.add('show');
        });

        plist.addEventListener('pointerleave', hidePreview);
    }

    /* ---------- Hero: cursor spotlight ---------- */

    const hero = $('.hero');
    if (hero && finePointer && !reduceMotion) {
        let spotX = 0;
        let spotY = 0;
        let spotRaf = null;

        hero.addEventListener('pointermove', (e) => {
            const rect = hero.getBoundingClientRect();
            spotX = e.clientX - rect.left;
            spotY = e.clientY - rect.top;
            if (spotRaf) return;
            spotRaf = requestAnimationFrame(() => {
                hero.style.setProperty('--mx', `${spotX.toFixed(0)}px`);
                hero.style.setProperty('--my', `${spotY.toFixed(0)}px`);
                spotRaf = null;
            });
        }, { passive: true });
    }

    /* ---------- Hero: live IST clock ---------- */

    const clock = $('#ist-clock');
    if (clock) {
        const fmt = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        const tick = () => {
            clock.textContent = fmt.format(new Date());
        };
        tick();
        setInterval(tick, 30000);
    }
})();
