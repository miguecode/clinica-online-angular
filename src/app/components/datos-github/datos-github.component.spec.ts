import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGithubComponent } from './datos-github.component';

describe('DatosGithubComponent', () => {
  let component: DatosGithubComponent;
  let fixture: ComponentFixture<DatosGithubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosGithubComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatosGithubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
