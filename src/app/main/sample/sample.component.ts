import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { locale as en } from './i18n/en'
import { locale as fr } from './i18n/fr'
import { locale as de } from './i18n/de'
import { locale as pt } from './i18n/pt'

import { CoreTranslationService } from '@core/services/translation.service'
import { Subject } from 'rxjs';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { CoreConfigService } from '../../../@core/services/config.service';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SampleComponent implements OnInit {
  //  Public
  public coreConfig: any;
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;
  public swiperResponsive: SwiperConfigInterface = {
    slidesPerView: 3,
    spaceBetween: 50,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 40
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 10
      }
    }
  };
  relatedProducts = [
    {
      id: 3,
      name: 'Willful Smart Watch for Men Women 2020,',
      slug: 'willful-smart-watch-for-men-women-2020-3',
      description:
        'Are you looking for a smart watch, which can not only easily keep tracking of your steps, calories, heart rate and sleep quality, but also keep you informed of incoming calls.',
      brand: 'Willful',
      price: 29.99,
      image: 'assets/images/pages/eCommerce/25.png',
      hasFreeShipping: true,
      rating: 5
    },
    {
      id: 4,
      name: 'Ronyes Unisex College Bag Bookbags for Women',
      slug: 'ronyes-unisex-college-bag-bookbags-for-women-4',
      description:
        'Made of high quality water-resistant material, padded and adjustable shoulder straps, external USB with built-in charging cable offers a convenient charging',
      brand: 'Ronyes',
      price: 23.99,
      image: 'assets/images/pages/eCommerce/24.png',
      hasFreeShipping: true,
      rating: 2
    },
    {
      id: 5,
      name: 'Toshiba Canvio Advance 2TB Portable External Hard Drive',
      slug: 'toshiba-canvio-advance-2-tb-portable-external-hard-drive-5',
      description: 'Up to 3TB of storage capacity to store your growing files and content',
      brand: 'Toshiba',
      price: 69.99,
      image: 'assets/images/pages/eCommerce/23.png',
      hasFreeShipping: true,
      rating: 2
    },
    {
      id: 6,
      name: 'Tile Pro - High Performance Bluetooth Tracker',
      slug: 'tile-pro-high-performance-bluetooth-tracker-6',
      description:
        'FIND KEYS, BAGS & MORE -- Pro is our high-performance finder ideal for keys, backpacks, luggage or any other items you want to keep track of. The easy-to-use finder and free app work with iOS and Android.',
      brand: 'Tile',
      price: 29.99,
      image: 'assets/images/pages/eCommerce/22.png',
      hasFreeShipping: false,
      rating: 4
    },
    {
      id: 7,
      name: 'Bugani M90 Portable Bluetooth Speaker',
      slug: 'bugani-m90-portable-bluetooth-speaker-7',
      description:
        'Bluetooth Speakers-The M90 Bluetooth speaker uses the latest Bluetooth 5.0 technology and the latest Bluetooth ATS chip, Connecting over Bluetooth in seconds to iPhone, iPad, Smart-phones, Tablets, Windows, and other Bluetooth devices.',
      brand: 'Bugani',
      price: 56.0,
      image: 'assets/images/pages/eCommerce/21.png',
      hasFreeShipping: false,
      rating: 3
    },
    {
      id: 8,
      name: 'PlayStation 4 Console',
      slug: 'play-station-4-console-8',
      description:
        'All the greatest, games, TV, music and more. Connect with your friends to broadcast and celebrate your epic moments at the press of the Share button to Twitch, YouTube, Facebook and Twitter.',
      brand: 'Sony',
      price: 339.95,
      image: 'assets/images/pages/eCommerce/20.png',
      hasFreeShipping: false,
      rating: 4
    }
  ];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private modalService: NgbModal
  ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // Login
    this.loading = true;

    // redirect to home page
    setTimeout(() => {
      this._router.navigate(['/']);
    }, 100);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  modalOpenVC(modalVC) {
    this.modalService.open(modalVC, {
      centered: true
    });
  }
}
