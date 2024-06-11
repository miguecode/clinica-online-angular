import { Component } from '@angular/core';
import { GithubService } from '../../services/APIs/GitHub/github.service';

@Component({
  selector: 'app-datos-github',
  standalone: true,
  imports: [],
  templateUrl: './datos-github.component.html',
  styleUrl: './datos-github.component.css'
})
export class DatosGithubComponent {
  nombre: string = '';
  nombreUsuario: string = '';
  ubicacion: string = '';
  biografia: string = '';
  usuarioTwitter: string = '';
  cantidadRepositorios: number = 0;
  fechaCreacion: string = '';
  avatar: string = ''; // Avatar es la URL de la imagen de perfil

  constructor(private githubService: GithubService) {  
    this.githubService.getGithubData().subscribe((data: any) => {
      this.nombre = data.name;
      this.nombreUsuario = data.login;
      this.ubicacion = data.location;
      this.biografia = data.bio;
      this.cantidadRepositorios = data.public_repos;
      this.usuarioTwitter = data.twitter_username;
      this.fechaCreacion = data.created_at;
      this.avatar = data.avatar_url;

      console.log(data);
    })
  }
}
