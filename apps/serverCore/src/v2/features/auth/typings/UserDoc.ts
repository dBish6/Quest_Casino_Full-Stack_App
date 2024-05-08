import RegisterRequestDto from "../dtos/RegisterRequestDto";

export default interface UserDoc extends RegisterRequestDto {
  _id: string;
}
