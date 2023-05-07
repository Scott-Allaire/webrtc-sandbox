import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
})
export class MediaComponent implements OnInit {
  cameraList: Array<any> = [];

  @ViewChild('localVideo') videoEl!: ElementRef<any>;

  ngOnInit(): void {
    // get initial list of media devices
    this.getConnectedDevices('videoinput').then((videoCameras) => {
      console.log('Cameras found:', videoCameras);
      this.updateCameraList(videoCameras);

      if (videoCameras.length > 0) {
        this.openCamera(videoCameras[0]);
      }
    });

    // listen for changes to media devices and update the list
    navigator.mediaDevices.addEventListener('devicechange', (event) => {
      this.getConnectedDevices('videoinput').then((videoCameras) => {
        console.log('Cameras found:', videoCameras);
        this.updateCameraList(videoCameras);
      });
    });
  }

  async getConnectedDevices(type: any): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === type);
  }

  updateCameraList(cameras: MediaDeviceInfo[]): void {
    this.cameraList = [];
    cameras
      .map((camera: any) => {
        return {
          label: camera.label || 'Unknown',
          value: camera.deviceId,
        };
      })
      .forEach((cameraOption: any) => this.cameraList.push(cameraOption));
  }

  async openCamera(camera: MediaDeviceInfo): Promise<void> {
    try {
      const constraints = { video: true, audio: false };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoEl.nativeElement.srcObject = stream;
    } catch (error) {
      console.error('Error opening video camera.', error);
    }
  }
}
