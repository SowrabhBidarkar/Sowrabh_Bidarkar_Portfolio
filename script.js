/* ==========================================================================
   Sowrabh Bidarkar — Portfolio Interactive Scripts & Three.js Canvas
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. Set Current Year in Footer
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 3. Mobile Navigation Menu Toggle
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
        });

        // Close mobile menu on link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
            });
        });
    }

    // 4. Scroll Reveal Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Active Section Navigation Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    });

    // 6. Three.js Subtle Ambient Background Scene
    initThreeJS();
});

/* ==========================================================================
   Three.js WebGL Subtle Floating Ambient Spheres & Particles
   ========================================================================== */
function initThreeJS() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 15;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Lights — violet/blue/teal for dark navy theme
    const ambientLight = new THREE.AmbientLight(0x0c0818, 1.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x8B72E8, 2.4, 65); // violet
    pointLight1.position.set(10, 10, 8);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x60A5FA, 1.8, 55); // blue
    pointLight2.position.set(-10, -8, 10);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x6EE7B7, 1.0, 45); // teal
    pointLight3.position.set(0, -14, 5);
    scene.add(pointLight3);

    // Floating Geometry 1: Glowing Violet Torus Knot
    const knotGeometry = new THREE.TorusKnotGeometry(2.2, 0.55, 120, 18);
    const knotMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x6B4FD8,
        emissive: 0x2A1080,
        emissiveIntensity: 0.55,
        transmission: 0.42,
        opacity: 0.80,
        transparent: true,
        roughness: 0.08,
        metalness: 0.12,
        ior: 1.65,
        thickness: 1.2,
        clearcoat: 1,
        clearcoatRoughness: 0.04
    });
    const torusKnot = new THREE.Mesh(knotGeometry, knotMaterial);
    torusKnot.position.set(8, -2, -3);
    scene.add(torusKnot);

    // Floating Geometry 2: Glowing Blue Sphere
    const sphereGeometry = new THREE.SphereGeometry(1.5, 40, 40);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x3B82F6,
        emissive: 0x1E3A8A,
        emissiveIntensity: 0.60,
        roughness: 0.16,
        metalness: 0.22,
        transparent: true,
        opacity: 0.70
    });
    const pearlSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    pearlSphere.position.set(-8, 3, -5);
    scene.add(pearlSphere);

    // Particle Cloud — bright violet, 260 dots
    const particleCount = window.innerWidth < 768 ? 120 : 260;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i]     = (Math.random() - 0.5) * 34;
        positions[i + 1] = (Math.random() - 0.5) * 34;
        positions[i + 2] = (Math.random() - 0.5) * 22;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.14,
        color: 0xA78BFA,
        transparent: true,
        opacity: 0.80,
        sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // Mouse Parallax Effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Object rotations
        torusKnot.rotation.x = elapsedTime * 0.2;
        torusKnot.rotation.y = elapsedTime * 0.25;

        pearlSphere.position.y = 3 + Math.sin(elapsedTime * 0.8) * 0.5;

        particleSystem.rotation.y = elapsedTime * 0.03;

        // Smooth Mouse Parallax Damping
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        camera.position.x = targetX * 1.5;
        camera.position.y = -targetY * 1.5;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Window Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}