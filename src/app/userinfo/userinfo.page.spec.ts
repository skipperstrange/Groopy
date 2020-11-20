import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserinfoPage } from './userinfo.page';

describe('UserinfoPage', () => {
  let component: UserinfoPage;
  let fixture: ComponentFixture<UserinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserinfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
