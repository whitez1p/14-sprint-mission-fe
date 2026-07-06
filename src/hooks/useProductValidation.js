export function useProductValidation({ name, description, price, tags }) {
  const errors = {
    name:
      name.length === 0
        ? "상품명을 입력해주세요"
        : name.length > 10
          ? "상품명은 10자 이내로 입력해주세요"
          : "",
    description:
      description.length === 0
        ? "상품 소개를 입력해주세요"
        : description.length > 0 && description.length < 10
          ? "상품 소개는 10자 이상 입력해주세요"
          : description.length > 100
            ? "상품 소개는 100자 이내로 입력해주세요"
            : "",
    price:
      price.length === 0
        ? "판매 가격을 입력해주세요"
        : price.length > 0 && !/^\d+$/.test(price)
          ? "판매 가격은 숫자로 입력해주세요"
          : "",
    tags: tags.length === 0
        ? "태그를 1개 이상 입력해주세요"
        : tags.some((t) => t.length > 5)
          ? "태그는 5글자 이내로 입력해주세요"
          : "",
  };

  const isValid =
    name.length >= 1 &&
    name.length <= 10 &&
    description.length >= 10 &&
    description.length <= 100 &&
    price.length >= 1 &&
    /^\d+$/.test(price) &&
    tags.length > 0 &&
    tags.every((t) => t.length <= 5);

  return { errors, isValid };
}
