document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuración de la Escena
    const container = document.getElementById('webgl-background');
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Renderer (Motor de renderizado)
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Escena y Cámara (Se usa una cámara ortográfica para renderizar un plano 2D)
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

    // Variables Uniformes (datos que se pasan de JS a GLSL)
    const uniforms = {
        u_time: { type: 'f', value: 0.0 },
        u_resolution: { type: 'v2', value: new THREE.Vector2(width, height) },
        u_mouse: { type: 'v2', value: new THREE.Vector2(0.5, 0.5) } // Posición del ratón (normalizada)
    };

    // 2. Crear el Material con Shaders GLSL
    const vertexShader = document.getElementById('vertexShader').textContent;
    const fragmentShader = document.getElementById('fragmentShader').textContent;

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    });

    // 3. Crear la Geometría (Un plano que cubre toda la cámara)
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 4. Bucle de Animación (El motor de la fluidez)
    let startTime = Date.now();
    function animate() {
        requestAnimationFrame(animate);

        const elapsed = (Date.now() - startTime) / 1000;
        uniforms.u_time.value = elapsed; // Actualiza el tiempo para animar el ruido en el shader

        renderer.render(scene, camera);
    }
    animate();

    // 5. Manejo de Eventos (Redimensionar y Movimiento del Ratón)

    // Redimensionar para adaptarse a cualquier tamaño de pantalla
    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        renderer.setSize(width, height);
        uniforms.u_resolution.value.set(width, height);
        // La cámara ortográfica no necesita mucha actualización, pero el mesh sí necesita los nuevos valores de resolución.
    });
    
    // Interacción con el ratón
    window.addEventListener('mousemove', (event) => {
        // Normaliza la posición del ratón de (0,0) a (1,1)
        uniforms.u_mouse.value.x = event.clientX / width;
        uniforms.u_mouse.value.y = 1.0 - (event.clientY / height); // Invierte el eje Y para WebGL
    });
});