import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  animalImage: string | null = null;
  animalType: 'dog' | 'cat' = 'dog';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarDoguinho();
  }

  carregarDoguinho() {
    this.animalType = 'dog';
    this.http.get<any>('https://dog.ceo/api/breeds/image/random').subscribe(res => {
      this.animalImage = res.message;
    });
  }

  carregarGatinho() {
    this.animalType = 'cat';
    this.http.get<any>('https://api.thecatapi.com/v1/images/search').subscribe(res => {
      this.animalImage = res[0].url;
    });
  }
}
