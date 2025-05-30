/**
 * 맵 렌더링 시스템
 * D3.js를 사용하여 세계 지도를 Canvas에 렌더링합니다.
 */
import * as d3 from 'd3';
import { geoPath, geoMercator } from 'd3-geo';
import { WorldMapData, WorldMapFeature } from '@/data/worldMap';

export interface MapRendererOptions {
  width: number;
  height: number;
  center?: [number, number]; // 지도 중심 [경도, 위도]
  scale?: number; // 지도 스케일
  selectedRegionId?: string | null; // 선택된 지역 ID
  hoverRegionId?: string | null; // 마우스 오버된 지역 ID
  regions?: { [key: string]: { color: string; } }; // 지역별 색상 설정
}

export class MapRenderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private worldData: WorldMapData;
  private options: MapRendererOptions;
  private projection: d3.GeoProjection;
  private pathGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  private isDragging: boolean = false;
  private dragStart: [number, number] | null = null;
  private zoomLevel: number = 1;

  /**
   * 맵 렌더러 생성자
   * @param canvas 렌더링할 Canvas 요소
   * @param worldData 세계 지도 데이터
   * @param options 렌더링 옵션
   */
  constructor(canvas: HTMLCanvasElement, worldData: WorldMapData, options: MapRendererOptions) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.worldData = worldData;
    this.options = {
      width: options.width || 800,
      height: options.height || 600,
      center: options.center || [0, 0],
      scale: options.scale || 150,
      selectedRegionId: options.selectedRegionId || null,
      hoverRegionId: options.hoverRegionId || null,
      regions: options.regions || {},
    };

    // 캔버스 크기 설정
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;

    // 지도 투영 초기화
    this.initProjection();

    // 이벤트 리스너 설정
    this.setupEventListeners();
  }

  /**
   * 지도 렌더링 함수
   */
  render() {
    // 캔버스 초기화
    this.context.clearRect(0, 0, this.options.width, this.options.height);
    
    // 배경 그리기
    this.context.fillStyle = '#a4c8e1'; // 바다 색상
    this.context.fillRect(0, 0, this.options.width, this.options.height);
    
    // 각 지역 그리기
    this.worldData.features.forEach(feature => {
      this.drawRegion(feature);
    });
    
    // 테두리 그리기
    this.context.strokeStyle = '#333';
    this.context.lineWidth = 0.5;
    this.worldData.features.forEach(feature => {
      this.context.beginPath();
      this.pathGenerator(feature.geometry);
      this.context.stroke();
    });
  }

  /**
   * 개별 지역 그리기 함수
   * @param feature 지역 데이터
   */
  private drawRegion(feature: WorldMapFeature) {
    const regionId = feature.id;
    const isSelected = regionId === this.options.selectedRegionId;
    const isHovered = regionId === this.options.hoverRegionId;
    
    // 지역 색상 결정
    let fillColor = '#d8d8d8'; // 기본 색상
    
    // 사용자 정의 색상이 있는 경우
    if (this.options.regions && this.options.regions[regionId]) {
      fillColor = this.options.regions[regionId].color;
    }
    
    // 선택/호버 상태에 따른 색상 조정
    if (isSelected) {
      fillColor = this.lightenDarkenColor(fillColor, 40); // 밝게
    } else if (isHovered) {
      fillColor = this.lightenDarkenColor(fillColor, 20); // 약간 밝게
    }
    
    // 지역 채우기
    this.context.beginPath();
    this.pathGenerator(feature.geometry);
    this.context.fillStyle = fillColor;
    this.context.fill();
  }

  /**
   * 색상 밝기 조정 함수
   * @param col 원래 색상 (HEX)
   * @param amt 조정량 (양수: 밝게, 음수: 어둡게)
   * @returns 조정된 색상 (HEX)
   */
  private lightenDarkenColor(col: string, amt: number): string {
    let usePound = false;
    
    if (col[0] === "#") {
      col = col.slice(1);
      usePound = true;
    }
    
    const num = parseInt(col, 16);
    
    let r = (num >> 16) + amt;
    r = Math.min(255, Math.max(0, r));
    
    let g = ((num >> 8) & 0x00FF) + amt;
    g = Math.min(255, Math.max(0, g));
    
    let b = (num & 0x0000FF) + amt;
    b = Math.min(255, Math.max(0, b));
    
    return (usePound ? "#" : "") + (g | (r << 8) | (b << 16)).toString(16).padStart(6, '0');
  }

  /**
   * 마우스 이벤트 리스너 설정
   */
  private setupEventListeners() {
    // 마우스 이동
    this.canvas.addEventListener('mousemove', (event) => {
      const [x, y] = this.getMousePosition(event);
      
      // 드래그 중인 경우 지도 이동
      if (this.isDragging && this.dragStart) {
        const dx = x - this.dragStart[0];
        const dy = y - this.dragStart[1];
        
        // 투영 중심 이동
        const currentCenter = this.projection.center();
        if (currentCenter) {
          this.projection.center([
            currentCenter[0] - (dx * 0.1) / this.zoomLevel,
            currentCenter[1] + (dy * 0.1) / this.zoomLevel
          ]);
          this.render();
        }
        
        this.dragStart = [x, y];
        return;
      }
      
      // 마우스 위치의 지역 확인
      const region = this.getRegionAtPoint(x, y);
      
      if (region && region.id !== this.options.hoverRegionId) {
        this.options.hoverRegionId = region.id;
        this.render();
      } else if (!region && this.options.hoverRegionId) {
        this.options.hoverRegionId = null;
        this.render();
      }
    });
    
    // 마우스 클릭
    this.canvas.addEventListener('click', (event) => {
      if (this.isDragging) return; // 드래그 중이면 클릭 무시
      
      const [x, y] = this.getMousePosition(event);
      const region = this.getRegionAtPoint(x, y);
      
      if (region) {
        this.options.selectedRegionId = region.id;
        this.render();
        
        // 클릭 이벤트 디스패치
        const clickEvent = new CustomEvent('regionClick', { 
          detail: { regionId: region.id } 
        });
        this.canvas.dispatchEvent(clickEvent);
      }
    });
    
    // 마우스 드래그 시작
    this.canvas.addEventListener('mousedown', (event) => {
      this.isDragging = true;
      this.dragStart = this.getMousePosition(event);
    });
    
    // 마우스 드래그 종료
    window.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.dragStart = null;
    });
    
    // 줌 이벤트
    this.canvas.addEventListener('wheel', (event) => {
      event.preventDefault();
      
      const direction = event.deltaY < 0 ? 1 : -1;
      const factor = 0.1;
      const zoom = 1 + factor * direction;
      
      this.zoomLevel *= zoom;
      this.zoomLevel = Math.max(0.5, Math.min(this.zoomLevel, 5)); // 줌 레벨 제한
      
      this.projection.scale(this.options.scale! * this.zoomLevel);
      this.render();
    });
  }

  /**
   * 마우스 위치 계산 함수
   * @param event 마우스 이벤트
   * @returns [x, y] 좌표
   */
  private getMousePosition(event: MouseEvent): [number, number] {
    const rect = this.canvas.getBoundingClientRect();
    return [
      event.clientX - rect.left,
      event.clientY - rect.top
    ];
  }

  /**
   * 특정 좌표에 있는 지역 찾기
   * @param x X 좌표
   * @param y Y 좌표
   * @returns 지역 객체 또는 null
   */
  private getRegionAtPoint(x: number, y: number): WorldMapFeature | null {
    // 투영 역변환으로 위도/경도 계산
    const lonLat = this.projection.invert!([x, y]);
    if (!lonLat) return null;
    
    // 해당 위치의 지역 찾기
    for (const feature of this.worldData.features) {
      // d3의 geoContains를 이용해 포인트가 지역 내부에 있는지 확인
      if (d3.geoContains(feature as any, lonLat)) {
        return feature;
      }
    }
    
    return null;
  }

  /**
   * 렌더러 옵션 업데이트
   * @param options 업데이트할 옵션
   */
  updateOptions(options: Partial<MapRendererOptions>) {
    this.options = { ...this.options, ...options };
    
    if (options.width || options.height) {
      this.canvas.width = this.options.width;
      this.canvas.height = this.options.height;
      this.projection.translate([this.options.width / 2, this.options.height / 2]);
    }
    
    if (options.center) {
      this.projection.center(this.options.center);
    }
    
    if (options.scale) {
      this.projection.scale(this.options.scale * this.zoomLevel);
    }
    
    this.render();
  }

  /**
   * 선택된 지역 설정
   * @param regionId 지역 ID
   */
  selectRegion(regionId: string | null) {
    this.options.selectedRegionId = regionId;
    this.render();
  }

  // 지도 투영 초기화
  private initProjection(): void {
    // 지도 투영 설정
    this.projection = geoMercator()
      .center(this.options.center || [0, 0]) // 기본값 제공
      .scale(this.options.scale)
      .translate([this.options.width / 2, this.options.height / 2]);
    
    // 지도 경로 생성기 설정
    this.pathGenerator = geoPath().projection(this.projection).context(this.context);
  }
} 