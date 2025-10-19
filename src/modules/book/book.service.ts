import { ForbiddenException, NotFoundException } from "@/lib";
import { BookRepository } from "./book.repository";
import type { CreateBookDto } from "./dto/create-book.dto";
import { type UpdateBookDto } from "./dto/update-book.dto";

export class BookService {
  private readonly bookRepository: BookRepository;
  constructor() {
    this.bookRepository = new BookRepository();
  }
  findAll() {
    return this.bookRepository.findAll();
  }
  findById(id: string) {
    return this.bookRepository.findById(id);
  }
  //   paginate() {}
  create(payload: CreateBookDto) {
    return this.bookRepository.create(payload);
  }
  async update(id: string, payload: UpdateBookDto) {
    const change = await this.bookRepository.update(id, payload);

    const rowCount = Number(change.rowCount);
    if (rowCount === 0) {
      throw new NotFoundException();
    }

    return change;
  }
  async delete(id: string) {
    const change = await this.bookRepository.delete(id);
    const rowCount = Number(change.rowCount);
    if (rowCount === 0) {
      throw new NotFoundException();
    }
    return change;
  }
}
