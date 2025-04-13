export function initWebGL(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas element with ID "${canvasId}" not found.`);
        return null;
    }

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        console.error('WebGL not supported or context creation failed.');
        return null;
    }

    if (!gl.VERTEX_SHADER || !gl.FRAGMENT_SHADER) {
        console.error('WebGL context does not support required shader types.');
        return null;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const vertexShaderSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision mediump float;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform float u_time;
        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            vec2 mouse = u_mouse / u_resolution.xy;
            float dist = distance(uv, mouse);
            float ripple = sin(dist * 20.0 - u_time * 5.0) * 0.05;
            vec2 distortedUV = uv + ripple;
            float r = sin(distortedUV.x * 10.0 + u_time) * 0.5 + 0.5;
            float g = sin(distortedUV.y * 10.0 + u_time + 2.0) * 0.5 + 0.5;
            float b = sin((distortedUV.x + distortedUV.y) * 10.0 + u_time + 4.0) * 0.5 + 0.5;
            vec3 color = vec3(r, g, b) * (1.0 - dist * 0.5);
            gl_FragColor = vec4(color, 0.7);
        }
    `;

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        if (!shader) {
            console.error('Failed to create shader with type:', type);
            return null;
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    if (!vertexShader) {
        console.error('Vertex shader creation failed.');
        return null;
    }

    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!fragmentShader) {
        console.error('Fragment shader creation failed.');
        gl.deleteShader(vertexShader);
        return null;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
    }
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const timeLocation = gl.getUniformLocation(program, 'u_time');

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = window.innerHeight - e.clientY;
    });

    const startTime = Date.now();
    function render() {
        const currentTime = (Date.now() - startTime) / 1000;
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform2f(mouseLocation, mouseX, mouseY);
        gl.uniform1f(timeLocation, currentTime);
        gl.clear(/*gl.COLOR_BUFFER_BIT*/0x4000);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
    }
    render();

    return gl;
}