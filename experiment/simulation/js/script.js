
const getElement = (id)=>{
    return document.getElementById(id);
}

const setText = (id, text) => {
    document.getElementById(id).innerText = text
}


const canvas1 = getElement('cnv1');
const ctx1 = canvas1.getContext('2d');
const canvas2 = getElement('cnv2');
const ctx2 = canvas2.getContext('2d');



const resetButton = getElement("resetButton");
const pauseButton = getElement("pauseButton");
const playButton = getElement("playButton");
const lockButton = getElement("lock_button");



var inputs = {
    M:1,
    r:10,
    m:0.1,
    l:0.1,
    h:1
}
let h0 = 1;

const g = 9.81




getElement('massDisc').addEventListener('input', ()=>{
    inputs.M = parseFloat(getElement('massDisc').value);
    getElement('massDisc_value').innerText = inputs.M;
    drawSetup();
})

getElement('radiusDisc').addEventListener('input', ()=>{
    inputs.r = parseFloat(getElement('radiusDisc').value);
    getElement('radiusDisc_value').innerText = inputs.r;
    drawSetup();
})

// getElement('stringLength').addEventListener('input', ()=>{
//     inputs.l = parseFloat(getElement('stringLength').value);
//     getElement('stringLength_value').innerText = inputs.l;
//     drawSetup();
// })

getElement('massHanging').addEventListener('input', ()=>{
    inputs.m = parseFloat(getElement('massHanging').value);
    getElement('massHanging_value').innerText = inputs.m;
    drawSetup();

})


getElement('heightFall').addEventListener('input', ()=>{
    inputs.h = parseFloat(getElement('heightFall').value);
    h0 = inputs.h
    getElement('heightFall_value').innerText = inputs.h;
    drawSetup();

})



const showInputs = (show)=>{
    if (!show){
        getElement('massDisc').hidden = true;
        getElement('radiusDisc').hidden = true;
        getElement('massHanging').hidden = true;
        getElement('heightFall').hidden = true;
    }
    else {
        getElement('massDisc').hidden = false;
        getElement('radiusDisc').hidden = false;
        getElement('massHanging').hidden = false;
        getElement('heightFall').hidden = false;
    }


}








const checkBox = ()=> {

    const lockButton = getElement('lock_button');

    if (lockButton.checked) {

        calculateTheoreticalValues();
        showInputs(false)

        lockButton.disabled = true;


    }

}


const calculateTheoreticalValues = ()=>{
    var I = 0.5 * inputs.M * Math.pow(inputs.r/100,2);
    var torque = (inputs.r/100) * inputs.m * g;

    getElement('inertia_theoretical').innerText = I.toFixed(4);
    getElement('torque_theoretical').innerText = torque.toFixed(2);

}

const getTheoreticalInertiaTorque = () =>{
    var I = 0.5 * inputs.M * Math.pow(inputs.r/100,2);
    var torque = (inputs.r/100) * inputs.m * g;

    return [I,torque];
}



let theta = 0; // Rotation angle of the pulley in radians
let omega = 0; // Angular velocity of the pulley in radians per second
let pulleyRadius = inputs.r + 15; // Radius of the pulley


let massY = 100 + (inputs.l * 100); // Initial Y position of the mass
let velocityY = 0; // Initial velocity in the Y direction
const gravity = 9.81; // Acceleration due to gravity in m/s^2
let time = 0; // Time elapsed since the start of the animation

let heightCovered = 0; // Height covered by the mass in meters
const deltaTime = 0.0167 


let angluarVelocities = [];
let angularAccelerations = [0];
let timeValues = []
let KEValues = []
let torqueValues = [0]


let prevOmega = 0
let prevTime = 0;

// Compute the effective acceleration 'a' using physics
let accelerationY = (inputs.m * gravity) / (inputs.m + (0.5 * inputs.M));
let torque = 0;
let angularAcceleration = 0;


let finalW = 0;
let finalKE = 0;

let lastTime = 0;




function updateSystem(currentTime) {
    accelerationY = (inputs.m * gravity) / (inputs.m + (0.5 * inputs.M));

     
    const MOI = 0.5 * inputs.M * Math.pow(inputs.r/100, 2);
    // var alpha = torque/MOI;

    const r_m = inputs.r / 100;
    const a = (inputs.m * gravity) / (inputs.m + (0.5 * inputs.M));
    angularAcceleration = a / r_m;

    velocityY += accelerationY * deltaTime;
    heightCovered += velocityY * deltaTime;

    omega += angularAcceleration * deltaTime;
    theta += omega * deltaTime; 
    
    prevOmega = omega;

    torque = MOI * angularAcceleration;


    angularAccelerations.push(angularAcceleration);
    angluarVelocities.push(omega);
    timeValues.push(currentTime);
    torqueValues.push(torque);

    if (currentTime-lastTime >=0.4){
        lastTime = currentTime;
        generateObservations(false);
    }
    



    if (heightCovered >= h0) {

        // finalW = torque*theta;
        // finalKE =   0.5 *MOI* Math.pow(omega, 2);

        getElement('showObservationsBtn').hidden = false;
        getElement('download-graph').hidden =false
        drawAngularAccelerationGraph(angularAccelerations,torqueValues);
        generateObservations(true)
        populateTable();
        stopAnimation();
      return;
  }

  drawSetup();


}






function drawAngularAccelerationGraph(angularAccelerations, torqueValues) {
    // Canvas dimensions
    const width = canvas2.width-50;
    const height = canvas2.height-100;

    // Graph dimensions and margins
    const margin = 70;
    const graphWidth = width - 2 * margin;
    const graphHeight = height - 2 * margin;

    ctx2.clearRect(0, 0, width, height);

    // Calculate max and min values
    const maxTorque = Math.max(...torqueValues);
    const minTorque = Math.min(...torqueValues);
    const maxAngularAcceleration = Math.max(...angularAccelerations);
    const minAngularAcceleration = Math.min(...angularAccelerations);

    // Adjust scaling for y-axis to handle both positive & negative values
    const torqueRange = maxTorque - minTorque;
    const yScale = graphHeight / torqueRange;

    // Adjust scaling for x-axis to handle both positive & negative values
    const angularAccelerationRange = maxAngularAcceleration - minAngularAcceleration;
    const xScale = graphWidth / angularAccelerationRange;

    // Draw background grid
    ctx2.strokeStyle = '#ced3d3'; // Light gray gridlines
    ctx2.lineWidth = 1;

    // Vertical gridlines (x-axis)
    for (let x = margin; x <= width - margin; x += graphWidth / 10) {
        ctx2.beginPath();
        ctx2.moveTo(x, margin);
        ctx2.lineTo(x, height - margin);
        ctx2.stroke();
    }

    // Horizontal gridlines (y-axis)
    for (let y = margin; y <= height - margin; y += graphHeight / 10) {
        ctx2.beginPath();
        ctx2.moveTo(margin, y);
        ctx2.lineTo(width - margin, y);
        ctx2.stroke();
    }

    // Draw axes
    ctx2.strokeStyle = '#333'; // Dark axes
    ctx2.lineWidth = 2;

    // X-axis
    ctx2.beginPath();
    ctx2.moveTo(margin, height - margin);
    ctx2.lineTo(width - margin, height - margin);
    ctx2.stroke();

    // Y-axis (Torque axis)
    ctx2.beginPath();
    ctx2.moveTo(margin, margin);
    ctx2.lineTo(margin, height - margin);
    ctx2.stroke();

    // Add title
    ctx2.fillStyle = '#000'; // Black title
    ctx2.font = '16px Arial';
    ctx2.textAlign = 'center';
    ctx2.fillText('Torque vs Angular Acceleration', width / 2, margin / 2);

    // Add axis labels
    ctx2.fillStyle = '#000';
    ctx2.font = '12px Arial';

    // X-axis label
    ctx2.fillText('Angular Acceleration', width / 2, height - margin / 4);

    // Y-axis label (Rotated)
    ctx2.save();
    ctx2.translate(margin / 4, height / 2);
    ctx2.rotate(-Math.PI / 2);
    ctx2.fillText('Torque', 0, 0);
    ctx2.restore();

    // X-axis ticks & labels
    ctx2.font = '10px Arial';
    ctx2.textAlign = 'center';
    ctx2.textBaseline = 'middle';

    for (let i = 0; i <= 10; i++) {
        const x = margin + (i / 10) * graphWidth;
        const value = (minAngularAcceleration + (i / 10) * angularAccelerationRange).toFixed(2);

        ctx2.beginPath();
        ctx2.moveTo(x, height - margin - 5);
        ctx2.lineTo(x, height - margin + 5);
        ctx2.stroke();
        ctx2.fillText(value, x, height - margin + 15);
    }

    // Y-axis ticks & labels
    ctx2.textAlign = 'right';
    for (let i = 0; i <= 10; i++) {
        const y = height - margin - (i / 10) * graphHeight;
        const value = (minTorque + (i / 10) * torqueRange).toFixed(3);

        ctx2.beginPath();
        ctx2.moveTo(margin - 5, y);
        ctx2.lineTo(margin + 5, y);
        ctx2.stroke();
        ctx2.fillText(value, margin - 10, y);
    }

    // Plot Torque vs Angular Acceleration
    ctx2.strokeStyle = '#e74c3c'; // Red line for graph
    ctx2.lineWidth = 2;
    ctx2.beginPath();

    for (let i = 0; i < torqueValues.length; i++) {
        const x = margin + ((angularAccelerations[i] - minAngularAcceleration) / angularAccelerationRange) * graphWidth;
        const y = height - margin - ((torqueValues[i] - minTorque) / torqueRange) * graphHeight;

        if (i === 0) {
            ctx2.moveTo(x, y);
        } else {
            ctx2.lineTo(x, y);
        }
    }
    ctx2.stroke();
}

drawAngularAccelerationGraph(angularAccelerations,torqueValues);







function showFormulaeModal() {
    const modal = document.getElementById('formulaeModal');
    const formulaeList = document.getElementById('formulaeList');
    
    // List of provided formulae
    const formulae = [
        "1. <strong>Moment of Inertia of the Disc</strong> (I)<br>" +
        "   <em>Formula:</em> I = (1/2) M R²<br>" +
        "   <em>Where:</em><br>" +
        "   - M = Mass of the disc (kg)<br>" +
        "   - R = Radius of the disc (m)",
    
        "2. <strong>Torque Due to Hanging Mass</strong> (τ)<br>" +
        "   <em>Formula:</em> τ = T R<br>" +
        "   <em>Where:</em><br>" +
        "   - T = Tension in the string (N)<br>" +
        "   - R = Radius of the disc (m)",
    
        "3. <strong>Rotational Equation of Motion</strong><br>" +
        "   <em>Formula:</em> I α = τ<br>" +
        "   <em>Where:</em><br>" +
        "   - I = Moment of inertia of the disc (kg·m²)<br>" +
        "   - α = Angular acceleration (rad/s²)<br>" +
        "   - τ = Torque (N·m)",
    
        "4. <strong>Linear and Angular Acceleration Relationship</strong><br>" +
        "   <em>Formula:</em> α = a / R<br>" +
        "   <em>Where:</em><br>" +
        "   - α = Angular acceleration (rad/s²)<br>" +
        "   - a = Linear acceleration of the mass (m/s²)<br>" +
        "   - R = Radius of the disc (m)",
    
        "5. <strong>Force Balance for Hanging Mass</strong><br>" +
        "   <em>Formula:</em> mg - T = m a<br>" +
        "   <em>Where:</em><br>" +
        "   - m = Mass of the hanging object (kg)<br>" +
        "   - g = Acceleration due to gravity (9.81 m/s²)<br>" +
        "   - T = Tension in the string (N)<br>" +
        "   - a = Linear acceleration (m/s²)",
    
        "6. <strong>Energy Conservation Equation</strong><br>" +
        "   <em>Formula:</em> mgh = (1/2) M v² + (1/2) I ω² + (1/2) m v²<br>" +
        "   <em>Where:</em><br>" +
        "   - m = Mass of the hanging object (kg)<br>" +
        "   - g = Acceleration due to gravity (9.81 m/s²)<br>" +
        "   - h = Height fallen by the mass (m)<br>" +
        "   - M = Mass of the disc (kg)<br>" +
        "   - v = Linear velocity of the mass (m/s)<br>" +
        "   - I = Moment of inertia of the disc (kg·m²)<br>" +
        "   - ω = Angular velocity of the disc (rad/s)",
    
        "7. <strong>Velocity of the Hanging Mass After Falling h</strong><br>" +
        "   <em>Formula:</em> v = √(2gh / (1 + M / (2m)))<br>" +
        "   <em>Where:</em><br>" +
        "   - m = Mass of the hanging object (kg)<br>" +
        "   - g = Acceleration due to gravity (9.81 m/s²)<br>" +
        "   - h = Height fallen by the mass (m)<br>" +
        "   - M = Mass of the disc (kg)",
    
        "8. <strong>Angular Velocity of the Disc After Falling h</strong><br>" +
        "   <em>Formula:</em> ω = v / R = √(2gh / (R²(1 + M / (2m))))<br>" +
        "   <em>Where:</em><br>" +
        "   - ω = Angular velocity of the disc (rad/s)<br>" +
        "   - v = Linear velocity of the hanging mass (m/s)<br>" +
        "   - R = Radius of the disc (m)",
    
        "9. <strong>Time Taken for the Mass to Fall</strong><br>" +
        "   <em>Formula:</em> t = √(2h / a)<br>" +
        "   <em>Where:</em><br>" +
        "   - h = Height fallen by the mass (m)<br>" +
        "   - a = Linear acceleration of the mass (m/s²)",
    
        "10. <strong>Final Angular Displacement of the Disc</strong><br>" +
        "   <em>Formula:</em> θ = (1/2) α t²<br>" +
        "   <em>Where:</em><br>" +
        "   - θ = Angular displacement of the disc (rad)<br>" +
        "   - α = Angular acceleration (rad/s²)<br>" +
        "   - t = Time taken for the mass to fall (s)"
    ];
    
    
      
  
    // Generate HTML for the formulae
    formulaeList.innerHTML = formulae.map(f => `<li>${f}</li>`).join('');
  
    // Show the modal
    modal.style.display = 'block';
  }
  
  // Close the formulae modal when the close button is clicked
  document.getElementById('closeFormulaeModal').onclick = function() {
    document.getElementById('formulaeModal').style.display = 'none';
  }
  
  // Close the modal if the user clicks outside of it
  window.onclick = function(event) {
    const formulaeModal = document.getElementById('formulaeModal');
    if (event.target === formulaeModal) {
      formulaeModal.style.display = 'none';
    }
  }



  let observations = [];

function generateObservations(stopped) {
    
     var InertiaTorque = getTheoreticalInertiaTorque();
     let rotKE = Number(InertiaTorque[0]) * 0.5 * omega*omega;
     let inertialPotentialEnergy = inputs.m * g * inputs.h;
     let linearKE = inertialPotentialEnergy - rotKE;
     let x = (linearKE*2) / (inputs.m);
     let velocity_t = Math.sqrt(x);

    

    

    let result = {
        sn: observations.length + 1,
        radius: inputs.r,
        mass: inputs.m.toFixed(3),
        dropHeight: inputs.h.toFixed(3),
        timeTaken: ((performance.now() - startTime) / 1000).toFixed(2),
        omega: omega.toFixed(3),
        alpha: angularAcceleration.toFixed(3),
        torque: torque.toFixed(3),
        workDone: finalW.toFixed(3),
        rotationalKE: rotKE.toFixed(3),
        inertialPE: inertialPotentialEnergy.toFixed(3),
        linearKE:linearKE.toFixed(3),
        velocity: velocity_t.toFixed(3)
    };

    

    observations.push(result);
}


// Function to populate table
function populateTable() {
    const g = 9.81;

    var InertiaTorque = getTheoreticalInertiaTorque();

    var lastObs = observations[observations.length-1];
  
    let descriptionHTML = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 1.4; margin-bottom: 16px; text-align: left;">
        <div><strong>Mass of Disc (M)</strong>: ${inputs.M} kg</div>
        <div><strong>Radius of Disc (r)</strong>: ${Number(inputs.r/100).toFixed(3)} m</div>
        <div><strong>Mass of Hanging Object (m)</strong>: ${inputs.m} kg</div>
        <div><strong>Height of Fall (h)</strong>: ${inputs.h} m</div>
        <div><strong>Moment of Inertia (I)</strong>: ${Number(InertiaTorque[0]).toFixed(5)} kg·m²</div>
        <div><strong>Linear Acceleration (a)</strong>: ${accelerationY.toFixed(2)} m/s²</div>
        <div><strong>Time to Fall (t)</strong>: ${lastObs.timeTaken} s</div>
        <div><strong>Torque (τ)</strong>: ${Number(InertiaTorque[1]).toFixed(2)} N-m</div>
      </div>
    `;
  
    let tableHTML = `
      <style>
        table {
          border-collapse: collapse;
          width: 100%;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 14px;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #444;
          padding: 6px 10px;
          text-align: center;
        }
        th {
          background-color: #f0f0f0;
        }
      </style>
  
      <table>
        <tr>
          <th>Time (t) (sec) </th>
          <th>Linear Velocity (v) (m/s)</th>
          <th>Angular Velocity (ω) (rad/s)</th>
          <th>Angular Acceleration (α) (rad/s²)</th>
          <th>Rotational Kinetic Energy (J)</th>
          <th>Translational Kinetic Energy (J)</th>
        </tr>`;

        
  
    observations.forEach(obs => {
      tableHTML += `
        <tr>
          <td>${obs.timeTaken}</td>
          <td>${obs.velocity}</td>
          <td>${obs.omega}</td>
          <td>${obs.alpha}</td>
          <td>${obs.rotationalKE}</td>
          <td>${obs.linearKE}</td>
        </tr>`;
    });
  
    tableHTML += `</table>`;
    
    let energyComparison = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; text-align: left; line-height: 1.6;">
    <h3 style="margin-bottom: 10px; font-size: 16px; color: #333;"> Energy Comparison</h3>
    <div><strong>Total Kinetic Energy (Rotational + Translational):</strong> ${(Number(lastObs.linearKE) + Number(lastObs.rotationalKE)).toFixed(3)} J</div>
    <div><strong>Initial Potential Energy (mgh):</strong> ${Number(lastObs.inertialPE).toFixed(3)} J</div>
    <div><strong>Number of Rotations:</strong> ${(inputs.h / (2 * Math.PI * (inputs.r / 100))).toFixed(2)}</div>
  </div>
`;




  
    resultsTableContainer.innerHTML = descriptionHTML + tableHTML + energyComparison;
  }


  

// Show modal on button click
showObservationsBtn.addEventListener("click", function () {
    resultsModal.style.display = "block";
});

// Close modal on close button click
closeResultsModal.addEventListener("click", function () {
    resultsModal.style.display = "none";
});

// Close modal if user clicks outside the modal content
window.addEventListener("click", function (event) {
    if (event.target === resultsModal) {
        resultsModal.style.display = "none";
    }
});

// Function to download results as CSV
function downloadResults() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "S.N.,Radius of Disc (cm),Mass of Disc (kg),Hanging Mass (kg),Drop Height (m),Time Taken (s),Angular Velocity (ω) (rad/s),Angular Acceleration (α) (rad/s²),Torque (τ),Rotational KE (½ Iω²) (J),Translational KE (J),Inertial PE (mgh) (J),Total KE (J)\n";

    observations.forEach(obs => {
        const totalKE = (Number(obs.linearKE) + Number(obs.rotationalKE)).toFixed(3);
        csvContent += `${obs.sn},${obs.radius},${inputs.M},${obs.mass},${obs.dropHeight},${obs.timeTaken},${obs.omega},${obs.alpha},${obs.torque},${obs.rotationalKE},${obs.linearKE},${obs.inertialPE},${totalKE}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "observations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


document.getElementById("download-btn").addEventListener("click", downloadResults);


document.getElementById('download-graph').addEventListener('click', function() {
    // Create a temporary offscreen canvas
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');

    // Match dimensions
    tempCanvas.width = canvas2.width;
    tempCanvas.height = canvas2.height;

    // Fill background with white
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw the original canvas content onto the white background
    ctx.drawImage(canvas2, 0, 0);

    // Export to PNG
    const imageUrl = tempCanvas.toDataURL('image/png');

    // Create a link to download the image
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'graph.png';
    link.click();
});




const drawSetup = (offset) =>{
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);


   

    ctx1.strokeStyle = 'black';
    ctx1.lineWidth = 3
    ctx1.beginPath();
    ctx1.moveTo(200, 20);
    ctx1.lineTo(280, 20);           // 80 pixels length
    ctx1.stroke();




    ctx1.strokeStyle = 'black';
    ctx1.lineWidth = 0.5
    let gap = 0;
    for (let i = 0; i < 7; i++) {
        ctx1.beginPath();
        ctx1.moveTo(200 + gap, 20);
        ctx1.lineTo(220 + gap, 6);
        ctx1.stroke();
        gap += 13;
    }

    ctx1.strokeStyle = 'black';
    ctx1.lineWidth = 4
    ctx1.beginPath();
    ctx1.moveTo(240,20);
    ctx1.lineTo(240,100);            // 80 pixels length
    ctx1.stroke();


   
    
    ctx1.strokeStyle = 'black';
    ctx1.lineWidth = 2
    ctx1.font = '20px Times New Roman';
    ctx1.beginPath();
    ctx1.fillText('Disc (M)', 120, 110);
    ctx1.stroke();

    
    // disc
    ctx1.save();


    ctx1.translate(240, 100);
    ctx1.rotate(theta);
    ctx1.translate(-240, -100);

    



    ctx1.fillStyle = 'black';
    ctx1.lineWidth = 3
    ctx1.beginPath();
    ctx1.arc(240,100,inputs.r+15,0,2*Math.PI);
    ctx1.fill();

    ctx1.fillStyle = 'white';
    ctx1.lineWidth = 3
    ctx1.beginPath();
    ctx1.arc(240,100,2,0,2*Math.PI);
    ctx1.fill();

    function arrow(circle, ang, radius) {
        circle.save();
        // Position arrow at arc's edge
        const x = 240 + (radius + 8) * Math.cos(ang);
        const y = 100 + (radius + 8) * Math.sin(ang);
        circle.translate(x, y);
        circle.rotate(ang + Math.PI / 2); // Adjust so arrow points along the arc direction
        circle.beginPath();
        circle.moveTo(-4, -4);
        circle.lineTo(0, 0);
        circle.lineTo(-4, 4);
        circle.stroke();
        circle.restore();
    }
    
    ctx1.strokeStyle = 'white';
    ctx1.lineWidth = 1.5;
    
    // Draw the arc
    ctx1.beginPath();
    ctx1.arc(240, 100, inputs.r + 8, Math.PI, 1.5 * Math.PI);
    ctx1.stroke();
    
    // Draw the arrow at end of arc
    arrow(ctx1,  1.5*Math.PI, inputs.r);
    



    ctx1.restore();


    // string 
    ctx1.strokeStyle = 'black';
    ctx1.lineWidth = 2.5
    ctx1.beginPath();
    ctx1.moveTo(240+inputs.r+15,100);
    ctx1.lineTo(240+inputs.r+15,100+((inputs.l+heightCovered)*100));            
    ctx1.stroke()


    let massHeight = 0.3;


    //mass
    var massX = (240+inputs.r+15) - 30
    massY = 100+((inputs.l+heightCovered)*100)

    ctx1.stokeStyle = 'grey';
    ctx1.lineWidth = 1.5
    ctx1.strokeRect(massX+15,massY, 30, (massHeight*100));
    ctx1.stroke();

    // ctx1.fillStyle = '#B6B6B6'
    // ctx1.font = '20px Times New Roman';
    // ctx1.fillText('m', massX+22, massY+24);
    // ctx1.stroke();

    ctx1.strokeStyle = 'black';
    ctx1.lineWidth = 2
    ctx1.font = '20px Times New Roman';
    ctx1.beginPath();
    ctx1.fillText('m', massX+22, massY+20);
    ctx1.stroke();






    // ground
    var groundY = 100+(inputs.l*100) + (massHeight*100) + (inputs.h*100)
    ctx1.strokeStyle = 'brown';
    ctx1.lineWidth = 1.5
    ctx1.beginPath();
    ctx1.moveTo(0, groundY);
    ctx1.lineTo(480, groundY);         
    ctx1.stroke();
    
    ctx1.strokeStyle = 'black';
    ctx1.lineWidth = 2
    ctx1.font = '20px Times New Roman';
    ctx1.beginPath();
    ctx1.fillText('Ground', 240, groundY+20);
    ctx1.stroke();
    



}


drawSetup()






let animationFrameId;
let isAnimating = false;
let startTime = 0;
let elapsedTime = 0;
let previousTime = 0;


const giveAlert = () => {
  window.alert("Lock the values first")
}


function updateTimer() {
  const currentTime = (performance.now() - startTime) / 1000; // Time in seconds
  setText("stopwatch", `Time: ${currentTime.toFixed(2)}s`);
}




function stopAnimation() {

  if (isAnimating) {
      isAnimating = false;
      cancelAnimationFrame(animationFrameId);
      const currentTime = (performance.now() - startTime) / 1000; // Time in seconds
      elapsedTime = currentTime; // Save elapsed time
  }
}



function animate(timestamp) {
  if (previousTime === 0) previousTime = timestamp;
  
  previousTime = timestamp;

  const currenttime = (performance.now() - startTime) / 1000;

  if (isAnimating) {
      updateSystem(currenttime);
      updateTimer();
      animationFrameId = requestAnimationFrame(animate);
  }
}



function startAnimation() {
  if (!lockButton.checked) {
      giveAlert()
      return
  }
  if (!isAnimating) {
      startTime = performance.now() - elapsedTime * 1000; // Continue from where it was left
      previousTime = 0; // Reset the previous time
      isAnimating = true;
      animationFrameId = requestAnimationFrame(animate);
  }
}



function resetAnimation (){
  stopAnimation();


  setText("stopwatch", "Time: 0.00s");
  elapsedTime = 0;
  previousTime = 0;
  startTime = 0;


  inputs = {
    M:1,
    r:10,
    m:0.1,
    l:0.1,
    h:1
  }

  h0 = 1;
  theta = 0;
  omega = 0
  pulleyRadius = inputs.r + 15;
  massY = 100 + (inputs.l * 100);
  velocityY = 0;



  observations = []
  lockButton.checked = false;

  lockButton.disabled = false;


  theta = 0; // Rotation angle of the pulley in radians
  omega = 0; // Angular velocity of the pulley in radians per second
  pulleyRadius = inputs.r + 15; // Radius of the pulley
  
  massY = 100 + (inputs.l * 100); // Initial Y position of the mass
  velocityY = 0; // Initial velocity in the Y direction
  time = 0; // Time elapsed since the start of the animation
  heightCovered = 0; // Height covered by the mass in meters
  angluarVelocities = [];
  angularAccelerations = [0];
  timeValues = [];
  KEValues = [];
  torqueValues = [0];
  prevOmega = 0;
  prevTime = 0;
  
  accelerationY = (inputs.m * gravity) / (inputs.m + (0.5 * inputs.M));


   showInputs(true)


    getElement('massDisc').value = 1;
    getElement('massDisc_value').innerText = 1;
    getElement('radiusDisc').value = 10;
    getElement('radiusDisc_value').innerText = 10;
    getElement('massHanging').value = 0.1;
    getElement('massHanging_value').innerText = 0.1;
    getElement('heightFall').value = 1;
    getElement('heightFall_value').innerText = 1;


    getElement('inertia_theoretical').innerText = 0;
    getElement('torque_theoretical').innerText = 0;



    drawSetup();
    drawAngularAccelerationGraph(angularAccelerations,torqueValues);


    getElement('showObservationsBtn').hidden = true;
    getElement('download-graph').hidden = true


}




playButton.addEventListener("click", startAnimation);
pauseButton.addEventListener("click", stopAnimation);
resetButton.addEventListener("click", resetAnimation);
