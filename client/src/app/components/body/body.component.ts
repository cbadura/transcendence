import {
	Component,
	OnInit,
	OnDestroy,
	ElementRef,
	Renderer2,
	AfterViewInit,
  } from '@angular/core';
  import { Subscription } from 'rxjs';
  import { UserDataService } from '../../services/user-data.service';
  import { User } from '../../shared/interfaces/user';
  
  @Component({
	selector: 'tcd-body',
	templateUrl: './body.component.html',
	styleUrls: ['./body.component.css'],
  })
  export class BodyComponent implements OnInit, OnDestroy, AfterViewInit {
	myUser!: User;
	noUser: boolean = true;
	private userSubscription!: Subscription;
  
	constructor(
	  private userDataService: UserDataService,
	  private el: ElementRef,
	  private renderer: Renderer2,
	) {}
  
	ngOnInit(): void {
	  this.userSubscription = this.userDataService.user$.subscribe((user) => {
		this.myUser = user;
		if (this.myUser && this.myUser.id != 0) this.noUser = false;
		this.updateOuterDivClass();
	  });
	}
  
	ngOnDestroy(): void {
	  this.userSubscription.unsubscribe();
	}
  
	ngAfterViewInit(): void {
	this.updateOuterDivClass();
	  this.listenForResize();
	}
  
	private updateOuterDivClass(): void {
	  const outerDiv = this.el.nativeElement.querySelector('.body-div');
	  const contentFitsWindow = window.innerHeight >= outerDiv.scrollHeight;
  
	  if (contentFitsWindow) {
		this.renderer.addClass(outerDiv, 'h-screen');
		this.renderer.removeClass(outerDiv, 'h-fit');
	  } else {
		this.renderer.removeClass(outerDiv, 'h-screen');
		this.renderer.addClass(outerDiv, 'h-fit');
	  }
	}
  
	private listenForResize(): void {
	  window.addEventListener('resize', (event) => this.onResize(event));
	}
  
	private onResize(event: Event): void {
	  this.updateOuterDivClass();
	}
  }
  