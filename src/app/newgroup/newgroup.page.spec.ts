import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewgroupPage } from './newgroup.page';

describe('NewgroupPage', () => {
  let component: NewgroupPage;
  let fixture: ComponentFixture<NewgroupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewgroupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewgroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
