import { Readable } from 'node:stream'
import z from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { InvalidFileFormatError } from './errors/invalid-file-format'

const uploadImageInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
})

type UploadImageInput = z.input<typeof uploadImageInput>

const allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']

export async function uploadImage(
  input: UploadImageInput
): Promise<Either<InvalidFileFormatError, { url: string }>> {
  const { fileName, contentType, contentStream } = uploadImageInput.parse(input)

  if (!allowedMimeTypes.includes(contentType)) {
    return makeLeft(new InvalidFileFormatError())
  }

  await db.insert(schema.uploads).values({
    name: fileName,
    remoteKey: fileName,
    remote_url: fileName,
  })

  return makeRight({ url: '' })
}
