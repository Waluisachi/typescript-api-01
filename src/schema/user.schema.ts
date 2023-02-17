import {object, string, TypeOf} from "zod";


export const userSchema = object(
        {
            body: object(
                    {
                        name: string({
                            required_error: "Name is required"
                        }),
                        password: string({
                            required_error: "Password is required"
                        }).min(6, "Password too short, should be 6 chars min"),
                        passwordConfirmation: string({
                            required_error: "Password confirmation required"
                        }),
                        email: string({
                            required_error: "Email required"
                        }).email("Not a valid email")
                    }
            ).refine(data => data.password === data.passwordConfirmation, {
                message: "Passwords do not match",
                path: ["passwordConfirmation"],
            })
        }
);

export type CreateUserInput = Omit<TypeOf<typeof userSchema>, "passwordConfirmation">;