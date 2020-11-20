import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmembersPage } from './addmembers.page';

describe('AddmembersPage', () => {
  let component: AddmembersPage;
  let fixture: ComponentFixture<AddmembersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddmembersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
