import { Router } from "express"
import { SpecificationsRepository } from "../modules/cars/repositories/SpecificationsRepository"
import { CreateSpecificationsService } from "../modules/cars/services/CreateSpecificationsService"

const specificationsRoutes = Router()

const specificationsRepository = new SpecificationsRepository()

specificationsRoutes.post('/', (request, response) => {
  const { name, description } = request.body

  const createSpecificationService = new CreateSpecificationsService(specificationsRepository)

  createSpecificationService.execute({ name, description })

  return response.status(201).send()
})

export { specificationsRoutes }
