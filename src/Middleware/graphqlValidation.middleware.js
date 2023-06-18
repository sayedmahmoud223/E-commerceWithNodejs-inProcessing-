export async function  graphQlValidation(Schema, inputs) {

    let { error } = Schema.validate(inputs, { abortEarly: false })
    if (error) {
        throw new Error(error)
    }
    return true
}