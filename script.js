let currentChart = null;

function calculateAndRender() {
    // 1. Get Inputs
    const a = parseFloat(document.getElementById('coeff-a').value) || 0;
    const b = parseFloat(document.getElementById('coeff-b').value) || 0;
    const c = parseFloat(document.getElementById('coeff-c').value) || 0;

    if (a === 0) {
        alert("Coefficient 'a' cannot be 0 in a quadratic equation.");
        return;
    }

    // 2. Format Equation string
    const formatTerm = (coef, variable, isFirst) => {
        if (coef === 0) return '';
        let sign = coef > 0 ? '+' : '-';
        if (isFirst) sign = coef < 0 ? '-' : '';
        else sign = ` ${sign} `;
        return `${sign}${Math.abs(coef)}${variable}`;
    };
    
    document.getElementById('display-eq').innerText = 
        `y = ${formatTerm(a, 'x²', true)}${formatTerm(b, 'x', false)}${formatTerm(c, '', false)}`;
        
    document.getElementById('term-a-val').innerText = `${a}x²`;
    document.getElementById('term-b-val').innerText = `${b > 0 ? '+'+b : b}x`;
    document.getElementById('term-c-val').innerText = `${c > 0 ? '+'+c : c}`;

    // 3. Math Calculations
    const vx = -b / (2 * a);
    const vy = (a * vx * vx) + (b * vx) + c;
    
    const discriminant = (b * b) - (4 * a * c);
    let root1 = null, root2 = null;
    let rootsText = "No real roots";
    let rootMsg = "The object never crosses the x-axis (ground level). It bounces off the anti-gravity field entirely!";

    if (discriminant >= 0) {
        root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        
        if (discriminant === 0) {
            rootsText = `x = ${root1.toFixed(2)}`;
            rootMsg = "There is only one real root. The object grazes the x-axis precisely at the vertex before returning.";
        } else {
            // Sort roots
            const rMin = Math.min(root1, root2);
            const rMax = Math.max(root1, root2);
            rootsText = `x = ${rMin.toFixed(2)}  OR  x = ${rMax.toFixed(2)}`;
            rootMsg = "Two distinct real roots. The object crosses the ground reference plane at these exact moments.";
        }
    }

    // 4. Update DOM Math Info
    document.getElementById('out-vertex').innerText = `(${vx.toFixed(2)}, ${vy.toFixed(2)})`;
    document.getElementById('out-axis').innerText = `x = ${vx.toFixed(2)}`;
    document.getElementById('out-yint').innerText = `(0, ${c})`;
    document.getElementById('out-direction').innerText = a > 0 ? "Upward (Repelling Field)" : "Downward (Attracting Gravity)";
    
    document.getElementById('int-axis').innerText = vx.toFixed(2);
    if (a < 0) {
        document.getElementById('out-inc').innerText = `(-∞, ${vx.toFixed(2)})`;
        document.getElementById('out-dec').innerText = `(${vx.toFixed(2)}, +∞)`;
    } else {
        document.getElementById('out-dec').innerText = `(-∞, ${vx.toFixed(2)})`;
        document.getElementById('out-inc').innerText = `(${vx.toFixed(2)}, +∞)`;
    }

    document.getElementById('out-roots').innerText = rootsText;
    document.getElementById('root-msg').innerText = rootMsg;

    // 5. Generate Chart Data
    let startX = vx - 5;
    let endX = vx + 5;
    if (discriminant > 0) {
        const span = Math.abs(root1 - root2);
        startX = Math.min(root1, root2) - (span * 0.3);
        endX = Math.max(root1, root2) + (span * 0.3);
    }

    const xValues = [];
    const yValues = [];
    const step = (endX - startX) / 100;

    for (let x = startX; x <= endX; x += step) {
        xValues.push(x.toFixed(2));
        yValues.push((a * x * x) + (b * x) + c);
    }

    // 6. Draw Chart
    const ctx = document.getElementById('motionChart').getContext('2d');
    
    if (currentChart) {
        currentChart.destroy();
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, a < 0 ? 'rgba(0, 240, 255, 0.8)' : 'rgba(0, 240, 255, 0.1)');
    gradient.addColorStop(1, a < 0 ? 'rgba(0, 240, 255, 0.1)' : 'rgba(0, 240, 255, 0.8)');

    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: `y = ${a}x² + ${b}x + ${c}`,
                data: yValues,
                borderColor: '#00F0FF',
                backgroundColor: gradient,
                borderWidth: 3,
                pointRadius: 0,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#B4B9C9', font: { family: 'Outfit', size: 14 } } }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Time / Distance (x)', color: '#00F0FF' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#B4B9C9', maxTicksLimit: 10 }
                },
                y: {
                    title: { display: true, text: 'Altitude (y)', color: '#00F0FF' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#B4B9C9' }
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Initial Render
    calculateAndRender();

    // Bind Button
    document.getElementById('update-btn').addEventListener('click', calculateAndRender);

    // Sidebar navigation active state updater
    const sections = document.querySelectorAll('.slide');
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.background = 'rgba(255, 255, 255, 0.05)';
            link.style.color = '#B4B9C9';
            if (link.getAttribute('href').includes(current)) {
                link.style.background = '#00F0FF';
                link.style.color = '#0A1128';
            }
        });
    });
});
