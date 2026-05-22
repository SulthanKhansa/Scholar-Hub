export interface CreateCategoryDto {
  nama: string;
  deskripsi?: string;
}

export interface UpdateCategoryDto {
  nama: string;
  deskripsi?: string;
}

export interface CreateSpeakerDto {
  nama: string;
  gelar: string;
  avatar?: string;
  bio?: string;
}

export interface UpdateSpeakerDto {
  nama: string;
  gelar: string;
  avatar?: string;
  bio?: string;
}

export interface CreateEventDto {
  judul: string;
  deskripsi: string;
  tanggal: string;
  lokasi: string;
  kategoriId: number;
  pembicaraId: number;
}

export interface UpdateEventDto {
  judul: string;
  deskripsi: string;
  tanggal: string;
  lokasi: string;
  kategoriId: number;
  pembicaraId: number;
}
