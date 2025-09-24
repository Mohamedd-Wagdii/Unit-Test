import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HeroServiceForLab } from './hero.lab.service';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

describe("HeroService HTTP Tests", () => {
  let heroService: HeroServiceForLab;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HeroServiceForLab,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection()
      ],
    });

    heroService = TestBed.inject(HeroServiceForLab);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it("getHeroes() should fetch heroes list successfully", () => {
    const fakeHeroes = [
      { id: 1, name: "Superman", strength: 100 },
      { id: 2, name: "Batman", strength: 80 }
    ];

    heroService.getHeroes().subscribe((data) => {
      expect(data).toEqual(fakeHeroes);
      expect(data.length).toBe(2);
    });

    const req = httpController.expectOne("http://localhost:3000/heroes");
    expect(req.request.method).toBe("GET");
    req.flush(fakeHeroes);
  });

  it("updateHero() should update hero and return the updated data", () => {
    const updatedHero = { id: 1, name: "Superman Updated", strength: 120 };

    heroService.updateHero(updatedHero).subscribe((result) => {
      expect(result).toEqual(updatedHero);
    });

    const req = httpController.expectOne("http://localhost:3000/heroes");
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual(updatedHero);
    req.flush(updatedHero);
  });
});
