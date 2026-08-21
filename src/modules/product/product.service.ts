import type {
  CreateProduct,
  UpdateProduct,
  User,
  USER_ROLE,
} from "@admin/types";
import {
  type FindAllProductsParams,
  ProductRepository,
} from "./product.repository";
import { auth, ForbiddenException } from "@/lib";

export class ProductService {
  private readonly productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  findAll(params?: FindAllProductsParams) {
    return this.productRepository.findAll(params);
  }

  findById(id: number) {
    return this.productRepository.findById(id);
  }

  findBySlug(slug: string) {
    return this.productRepository.findBySlug(slug);
  }

  async create(data: CreateProduct, user: User) {
    const canCreateProject = await auth.api.userHasPermission({
      body: {
        userId: user.id,
        permissions: {
          product: ["create"],
        },
        role: user.role as USER_ROLE,
      },
    });

    if (!canCreateProject)
      throw new ForbiddenException({
        message: "You do not have permission to perform this action",
      });

    return await this.productRepository.create(data);
  }

  update(id: number | string, data: UpdateProduct) {
    return this.productRepository.update(Number(id), data);
  }

  delete(id: number | string) {
    return this.productRepository.delete(Number(id));
  }
}
