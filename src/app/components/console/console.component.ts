import {Component, OnInit} from '@angular/core';
import * as THREE from 'three';
import {Helicopter} from "./models/helicopter";
import {Clock, OrthographicCamera, Scene, WebGLRenderer} from "three/three-core";

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  private unitX = window.innerWidth / 100;
  private unitY = window.innerHeight / 100;

  private scene: Scene;
  private camera: OrthographicCamera;
  private renderer: WebGLRenderer;
  private clock: Clock;

  private g = -9.8 * (this.unitY * 30);
  private a = 9.8 * (this.unitY * 30);

  private terminalVYUp = window.innerWidth / 100 * 30;
  private terminalVYDown = window.innerWidth / 100 * 50;

  private helicopter: Helicopter;

  constructor() {
  }

  ngOnInit() {
    this.initialize();

    let animate = () => {
      requestAnimationFrame(animate);

      let deltaTime = this.clock.getDelta();

      this.moveHelicopter(deltaTime);
      this.moveCave(deltaTime);

      // Render the scene
      this.renderer.render(this.scene, this.camera);
    };

    // Animate
    animate();
  }

  /**
   * Initialize the game objects
   */
  initialize(): void {
    // Initialize the scene
    this.scene = new THREE.Scene();

    // Initialize the camera
    this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2,
      window.innerHeight / 2, window.innerHeight / -2, 1, 100);
    this.camera.position.z = 10;

    // Initialize the renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Initialize the clock
    this.clock = new THREE.Clock();
    this.clock.getDelta();

    // Add a Helicopter object
    this.helicopter = new Helicopter(this.unitX, this.unitY);
    this.scene.add(this.helicopter.object);

    // x position of the helicopter
    this.helicopter.object.position.x = this.unitX * -25;

    // Mouse-down event listener
    document.body.addEventListener('mousedown', () => {
      this.helicopter.isAccelerating = true;
    });

    // Mouse-up event listener
    document.body.addEventListener('mouseup', () => {
      this.helicopter.isAccelerating = false;
    })
  }

  /**
   * Move the Helicopter
   * @param {number} deltaTime
   */
  moveHelicopter(deltaTime: number): void {
    this.helicopter.object.position.y += this.helicopter.vY * deltaTime;

    if (this.helicopter.isAccelerating) {
      // Accelerate
      this.helicopter.vY += this.a * deltaTime;

      // Check if greater than terminal velocity
      if (this.helicopter.vY > this.terminalVYUp) {
        this.helicopter.vY = this.terminalVYUp;
      }
    } else {
      // Fall in gravity
      this.helicopter.vY += this.g * deltaTime;

      // Check if greater than terminal velocity
      if (this.helicopter.vY < -1 * this.terminalVYDown) {
        this.helicopter.vY = -1 * this.terminalVYDown;
      }
    }
  }

  /**
   * Move the Cave
   * @param {number} deltaTime
   */
  moveCave(deltaTime: number): void {

  }

}