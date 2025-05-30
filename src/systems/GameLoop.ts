/**
 * 게임 루프 시스템
 * requestAnimationFrame을 활용한 게임 루프와 더블 버퍼링 시스템을 구현합니다.
 */

export interface GameLoopOptions {
  fps?: number;          // 목표 FPS
  updateCallback: (dt: number) => void; // 업데이트 콜백 함수 (dt: 이전 프레임과의 시간 차이, 초 단위)
  renderCallback: () => void; // 렌더링 콜백 함수
  fixedTimeStep?: boolean; // 고정 시간 단계 사용 여부
}

export class GameLoop {
  private options: Required<GameLoopOptions>;
  private running: boolean = false;
  private rafId: number | null = null;
  private lastTime: number = 0;
  private accumulator: number = 0;
  private timeStep: number;

  /**
   * 게임 루프 생성자
   * @param options 게임 루프 옵션
   */
  constructor(options: GameLoopOptions) {
    this.options = {
      fps: options.fps || 60,
      updateCallback: options.updateCallback,
      renderCallback: options.renderCallback,
      fixedTimeStep: options.fixedTimeStep !== undefined ? options.fixedTimeStep : true
    };

    // 시간 단계 계산 (초 단위)
    this.timeStep = 1 / this.options.fps;
  }

  /**
   * 게임 루프 시작
   */
  start(): void {
    if (this.running) return;
    
    this.running = true;
    this.lastTime = performance.now() / 1000; // 초 단위로 변환
    this.accumulator = 0;
    
    this.loop(this.lastTime);
  }

  /**
   * 게임 루프 일시 정지
   */
  pause(): void {
    if (!this.running) return;
    
    this.running = false;
    
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * 게임 루프 중지 및 리셋
   */
  stop(): void {
    this.pause();
    this.accumulator = 0;
  }

  /**
   * 메인 게임 루프 함수
   * @param currentTime 현재 시간 (초 단위)
   */
  private loop(currentTime: number): void {
    if (!this.running) return;
    
    this.rafId = requestAnimationFrame((time) => this.loop(time / 1000));
    
    const deltaTime = Math.min(0.1, currentTime - this.lastTime); // 최대 0.1초 제한 (프레임 건너뛰기 방지)
    this.lastTime = currentTime;
    
    // 고정 시간 단계 사용 시
    if (this.options.fixedTimeStep) {
      this.accumulator += deltaTime;
      
      // 누적된 시간이 시간 단계보다 크면 업데이트 실행
      while (this.accumulator >= this.timeStep) {
        this.options.updateCallback(this.timeStep);
        this.accumulator -= this.timeStep;
      }
    } else {
      // 가변 시간 단계 사용 시
      this.options.updateCallback(deltaTime);
    }
    
    // 렌더링 콜백 실행
    this.options.renderCallback();
  }
}

/**
 * 더블 버퍼링 캔버스 클래스
 * 두 개의 캔버스를 사용하여 더블 버퍼링을 구현합니다.
 */
export class DoubleBufferCanvas {
  // 화면에 표시되는 캔버스
  readonly displayCanvas: HTMLCanvasElement;
  // 화면 외부에서 그림을 그리는 버퍼 캔버스
  readonly bufferCanvas: HTMLCanvasElement;
  
  private displayContext: CanvasRenderingContext2D;
  private bufferContext: CanvasRenderingContext2D;

  /**
   * 더블 버퍼 캔버스 생성자
   * @param container 캔버스를 포함할 컨테이너 요소
   * @param width 캔버스 너비
   * @param height 캔버스 높이
   */
  constructor(container: HTMLElement, width: number, height: number) {
    // 디스플레이 캔버스 생성 및 설정
    this.displayCanvas = document.createElement('canvas');
    this.displayCanvas.width = width;
    this.displayCanvas.height = height;
    container.appendChild(this.displayCanvas);
    
    // 버퍼 캔버스 생성 및 설정
    this.bufferCanvas = document.createElement('canvas');
    this.bufferCanvas.width = width;
    this.bufferCanvas.height = height;
    
    // 컨텍스트 가져오기
    this.displayContext = this.displayCanvas.getContext('2d') as CanvasRenderingContext2D;
    this.bufferContext = this.bufferCanvas.getContext('2d') as CanvasRenderingContext2D;
  }

  /**
   * 버퍼 캔버스 내용을 디스플레이 캔버스로 복사
   */
  flip(): void {
    this.displayContext.clearRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);
    this.displayContext.drawImage(this.bufferCanvas, 0, 0);
  }

  /**
   * 버퍼 캔버스 초기화
   */
  clear(): void {
    this.bufferContext.clearRect(0, 0, this.bufferCanvas.width, this.bufferCanvas.height);
  }

  /**
   * 캔버스 크기 변경
   * @param width 새 너비
   * @param height 새 높이
   */
  resize(width: number, height: number): void {
    this.displayCanvas.width = width;
    this.displayCanvas.height = height;
    this.bufferCanvas.width = width;
    this.bufferCanvas.height = height;
  }

  /**
   * 버퍼 컨텍스트 반환
   * @returns 버퍼 캔버스의 2D 컨텍스트
   */
  getContext(): CanvasRenderingContext2D {
    return this.bufferContext;
  }
} 