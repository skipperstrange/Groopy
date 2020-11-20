import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagemodalPage } from './imagemodal.page';

describe('ImagemodalPage', () => {
  let component: ImagemodalPage;
  let fixture: ComponentFixture<ImagemodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagemodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagemodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
