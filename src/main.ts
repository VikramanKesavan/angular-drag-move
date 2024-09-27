import { Component, ViewChild, ElementRef } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="container">
  <div class="rectangle" #rectangle></div>
</div>
  `,
  styleUrls: ['./main.css'],
})
export class App {
  @ViewChild('rectangle', { static: true }) rectangle: ElementRef = <any>(
    undefined
  );

  private isDragging = false;
  private isResizing = false;
  private activeHandle: HTMLElement | null = null;
  // Create the handle elements
  private handles = [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    'top',
    'right',
    'bottom',
    'left',
  ];

  private originalPosition: { x: number; y: number } = { x: 0, y: 0 };
  private originalSize: { width: number; height: number } = {
    width: 0,
    height: 0,
  };

  private mouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.originalPosition = {
      x: this.rectangle.nativeElement.offsetLeft,
      y: this.rectangle.nativeElement.offsetTop,
    };
  }

  private mouseMove(event: any) {
    if (this.isDragging) {
      const deltaX = event.clientX - this.originalPosition.x;
      const deltaY = event.clientY - this.originalPosition.y;

      this.rectangle.nativeElement.style.left = `${
        this.originalPosition.x + deltaX
      }px`;
      this.rectangle.nativeElement.style.top = `${
        this.originalPosition.y + deltaY
      }px`;
    } else if (this.isResizing && !!this.activeHandle) {
      const deltaX = event.clientX - this.activeHandle.offsetLeft;
      const deltaY = event.clientY - this.activeHandle.offsetTop;
      const className = this.activeHandle.className;
      switch (className) {
        case 'handle top-left':
          this.rectangle.nativeElement.style.width = `${
            this.originalSize.width - deltaX
          }px`;
          this.rectangle.nativeElement.style.height = `${
            this.originalSize.height - deltaY
          }px`;
          this.rectangle.nativeElement.style.left = `${
            this.originalPosition.x + deltaX
          }px`;
          this.rectangle.nativeElement.style.top = `${
            this.originalPosition.y + deltaY
          }px`;
          break;
        case 'handle top-right':
          this.rectangle.nativeElement.style.width = `${
            this.originalSize.width + deltaX
          }px`;
          this.rectangle.nativeElement.style.height = `${
            this.originalSize.height - deltaY
          }px`;
          this.rectangle.nativeElement.style.top = `${
            this.originalPosition.y + deltaY
          }px`;
          break;
        case 'handle bottom-left':
          this.rectangle.nativeElement.style.width = `${
            this.originalSize.width - deltaX
          }px`;
          this.rectangle.nativeElement.style.height = `${
            this.originalSize.height + deltaY
          }px`;
          this.rectangle.nativeElement.style.left = `${
            this.originalPosition.x + deltaX
          }px`;
          break;
        case 'handle bottom-right':
          this.rectangle.nativeElement.style.width = `${
            this.originalSize.width + deltaX
          }px`;
          this.rectangle.nativeElement.style.height = `${
            this.originalSize.height + deltaY
          }px`;
          break;
        case 'handle top':
          this.rectangle.nativeElement.style.height = `${
            this.originalSize.height - deltaY
          }px`;
          this.rectangle.nativeElement.style.top = `${
            this.originalPosition.y + deltaY
          }px`;
          break;
        case 'handle right':
          this.rectangle.nativeElement.style.width = `${
            this.originalSize.width + deltaX
          }px`;
          break;
        case 'handle bottom':
          this.rectangle.nativeElement.style.height = `${
            this.originalSize.height + deltaY
          }px`;
          break;
        case 'handle left':
          this.rectangle.nativeElement.style.width = `${
            this.originalSize.width - deltaX
          }px`;
          this.rectangle.nativeElement.style.left = `${
            this.originalPosition.x + deltaX
          }px`;
          break;
      }
    }
  }

  private mouseUp(event: MouseEvent) {
    this.isDragging = false;
    this.isResizing = false;
    this.activeHandle = null;
  }

  private handleMouseDown(event: MouseEvent) {
    this.isResizing = true;
    this.activeHandle = event.target as HTMLElement;
    this.originalSize = {
      width: this.rectangle.nativeElement.offsetWidth,
      height: this.rectangle.nativeElement.offsetHeight,
    };
    event.stopPropagation();
  }

  ngOnInit() {
    const rectangle = this.rectangle.nativeElement;
    document.addEventListener('mousedown', this.mouseDown.bind(this));
    document.addEventListener('mousemove', this.mouseMove.bind(this));
    document.addEventListener('mouseup', this.mouseUp.bind(this));
    document.addEventListener('mouseleave', this.mouseUp.bind(this));

    // Create the adorner element
    const adorners = document.createElement('div');
    adorners.classList.add('adorners');
    rectangle.appendChild(adorners);

    this.handles.forEach((handle) => {
      const handleElement = document.createElement('div');
      handleElement.classList.add('handle', handle);
      handleElement.addEventListener(
        'mousedown',
        this.handleMouseDown.bind(this)
      );
      adorners.appendChild(handleElement);
    });
  }

  ngOnDestroy() {
    const rectangle = this.rectangle.nativeElement;
    document.removeEventListener('mousedown', this.mouseDown.bind(this));
    document.removeEventListener('mousemove', this.mouseMove.bind(this));
    document.removeEventListener('mouseup', this.mouseUp.bind(this));
    document.removeEventListener('mouseleave', this.mouseUp.bind(this));

    this.handles.forEach((handle) => {
      const handles = document.querySelectorAll('.handle');
      handles.forEach((item) => {
        const element = item as HTMLElement;
        element.removeEventListener(
          'mousedown',
          this.handleMouseDown.bind(this)
        );
      });
    });
  }
}

bootstrapApplication(App);
