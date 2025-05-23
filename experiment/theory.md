# Theory

The experiment demonstrates the fundamental principles of rotational dynamics and the application of the work-energy theorem in rotational motion. It involves a rigid disc mounted on a horizontal axis with a light, inextensible string wound around its circumference. A mass is suspended from the free end of the string, and upon release, the falling mass causes the disc to rotate due to the torque generated by the tension in the string.

## 1. Newton's Second Law for Rotational Motion

In linear motion, Newton's second law states that the net force acting on an object is proportional to its linear acceleration:

F = m·a

where F is force, m is mass, and a is linear acceleration. Analogously, in rotational motion, the net torque (τ) acting on a rigid body is proportional to its angular acceleration (α):

τ = I·α

Here, I is the moment of inertia, a measure of an object's resistance to rotational acceleration, dependent on its mass distribution relative to the axis of rotation. Torque is defined as:

τ = r × F = r·F·sinθ

where r is the lever arm (distance from the axis to the point of force application), F is the applied force, and θ is the angle between r and F. For simplicity, if the force is applied tangentially (θ=90°), this reduces to:

τ = r·F

The moment of inertia (I) for discrete particles is expressed as I = Σ mᵢrᵢ², and for continuous bodies as I = ∫ r² dm. This experiment assumes a rigid body with constant I, ensuring angular acceleration depends solely on torque.

## 2. Torque and Angular Acceleration in the Experimental System

The experiment involves a rigid disc of radius r mounted on a horizontal axis, with a mass m suspended from a light, inextensible string wound around the disc's circumference. When the mass is released, the gravitational force m·g generates tension T in the string, which applies a torque (τ) to the disc.

### Torque from Tension

By definition, torque is given by:

τ = r × F = r·F·sinθ

In this setup, the string applies force tangentially to the disc (θ=90°), simplifying the torque to:

τ = r·T

From the rotational form of Newton's second law (τ = I·α), the angular acceleration α of the disc is:

α = τ/I = r·T/I

### Kinematic Constraint: No-Slip Condition

The linear acceleration a of the falling mass is related to the disc's angular acceleration by the no-slip condition:

a = r·α

### Combining Linear and Rotational Dynamics

1. For the falling mass (linear motion):

m·g - T = m·a

2. For the disc (rotational motion):  
   Substitute τ = r·T = I·α and α = a/r to express tension T as:

T = I·α/r = I·a/r²

3. Solve for acceleration a:

Substitute T = I·a/r² into m·g - T = m·a:

m·g - I·a/r² = m·a

m·g = a(m + I/r²)

Rearranging gives:

a = m·g/(m + I/r²),  
α = a/r

This shows that the disc's moment of inertia I reduces the acceleration of the falling mass compared to free fall (a < g).

## 3. Work-Energy Theorem in Rotational Dynamics

The work-energy theorem states that the net work done on a system equals its change in kinetic energy. For linear motion:

W = ΔKE_linear = ½m(v_f² - v_i²)

In rotational motion, work done by torque is defined as:

W = ∫ τ dθ

where θ is the angular displacement. For constant torque, this simplifies to:

W = τ·Δθ

Rotational kinetic energy (KE_rot) is given by:

KE_rot = ½Iω²,

where ω is the angular velocity. The work-energy theorem for rotation states:

W = ΔKE_rot = ½I(ω_f² - ω_i²)

### Derivation

Starting with W = ∫ τ dθ and substituting τ = I·α = I·dω/dt:

W = ∫ I·(dω/dt) dθ

Using dθ = ω dt, this becomes:

W = I ∫ ω dω = ½I(ω_f² - ω_i²)

Thus, the work done by net torque equals the change in rotational kinetic energy, assuming I is constant.

## 4. Energy Considerations in Rotational Motion

The work-energy theorem for rotational motion states that the net work done by torque is equal to the change in rotational kinetic energy:

W = ΔKE_rot = ½I(ω_f² - ω_i²)

where ω_i and ω_f are the initial and final angular velocities. In this experiment:

1. Work done by torque (W_τ): As the mass falls through height h, the tension T in the string performs work on the disc:

W_τ = τ·Δθ = r·T·Δθ

where Δθ = h/r (angular displacement of the disc).

2. Change in gravitational potential energy (ΔPE):

ΔPE = m·g·h

3. Change in kinetic energy (ΔKE):

ΔKE = ½Iω_f² + ½m·v_f² (rotational + translational)

By conservation of mechanical energy (assuming negligible friction):

ΔPE = ΔKE

m·g·h = ½Iω_f² + ½m·v_f²

## 5. Theoretical Predictions for the Experiment

### I. Torque-Angular Acceleration Relationship
A rotating disk or pulley with a known I will experience a torque via a tension force from a falling mass. By varying the applied torque (e.g., changing r or F) and measuring α (via angular displacement sensors), the proportionality τ ∝ α can be tested. The slope of τ vs. α should equal I.

### II. Work-Energy Verification
By calculating the work done by torque (W = τ·Δθ) and comparing it to the change in rotational kinetic energy (ΔKE_rot), the work-energy theorem can be validated. Discrepancies may arise from non-conservative forces (e.g., friction), which must be minimized or accounted for.

### III. Experimental Validation
By measuring a (via time-distance kinematics) and α (using angular sensors), the relationship τ = I·α can be tested. A plot of τ (calculated as r·T) vs. α should yield a straight line with slope I, confirming Newton's second law for rotation.

# Observation Table

| Moment of Inertia (I) [kg·m²] | Linear Velocity (v) [m/s] | Angular Velocity (ω) [rad/s] | Angular Acceleration (α) [rad/s²] | Rotational Kinetic Energy [J] | Translational Kinetic Energy [J] | Total Kinetic Energy [J] | Initial Potential Energy [J] |
|-------------------------------|--------------------------|-----------------------------|-----------------------------------|-------------------------------|----------------------------------|--------------------------|------------------------------|
|                               |                          |                             |                                   |                               |                                  |                          |                              |
|                               |                          |                             |                                   |                               |                                  |                          |                              |
