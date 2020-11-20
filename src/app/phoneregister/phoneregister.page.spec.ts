import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneregisterPage } from './phoneregister.page';

describe('PhoneregisterPage', () => {
  let component: PhoneregisterPage;
  let fixture: ComponentFixture<PhoneregisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneregisterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneregisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
