describe("sign-up page test", () => {
  beforeEach(() => {
    cy.visit("/auth?mode=signup")
  })
  it("should visit sign up page", () => {
    cy.contains("회원가입").should("be.visible")
    cy.contains("이름").should("be.visible")
    cy.contains("아이디").should("be.visible")
    cy.contains("회사명").should("be.visible")
    cy.contains("비밀번호").should("be.visible")
    cy.contains("비밀번호 확인").should("be.visible")
  })

  it("should show error message", () => {
    cy.get("#name").click()
    cy.get("#name").blur()
    cy.contains("이름을 입력해주세요.").should("be.visible")
    cy.get("#email").focus()
    cy.get("#email").blur()
    cy.contains("이메일을 입력해주세요.").should("be.visible")
    cy.get("#email").type("123")
    cy.get("#email").blur()
    cy.contains("올바른 이메일 형식이 아닙니다.").should("be.visible")
    cy.get("#companyName").focus()
    cy.get("#companyName").blur()
    cy.contains("회사명을 입력해주세요.").should("be.visible")
    cy.get("#password").focus()
    cy.get("#password").blur()
    cy.contains("비밀번호를 입력해주세요.").should("be.visible")
    cy.get("#password").type("1234")
    cy.get("#password").blur()
    cy.contains("비밀번호는 최소 8자 이상이어야 합니다.").should("be.visible")
    cy.get("#passwordConfirm").focus()
    cy.get("#passwordConfirm").blur()
    cy.contains("비밀번호를 다시 한번 입력해주세요.").should("be.visible")
    cy.get("#passwordConfirm").type("1")
    cy.get("#passwordConfirm").blur()
    cy.contains("비밀번호가 일치하지 않습니다.").should("be.visible")
    cy.get(".group").should("be.disabled")
  })

  it("should show password after clicking button", () => {
    cy.get("#password").type("1234")
    cy.get("button > div > svg").first().click()
    cy.get("#password").should("have.attr", "type").and("equal", "text")
    cy.get("button > div > svg").first().click()
    cy.get("#password").should("have.attr", "type").and("equal", "password")
  })

  it("should be disable to sign up with same email", () => {
    cy.get("#name").type("test")
    cy.get("#name").blur()
    cy.get("#email").type("test10@test10.com")
    cy.get("#email").blur()
    cy.get("#companyName").type("test10")
    cy.get("#companyName").blur()
    cy.get("#password").type("testtest")
    cy.get("#password").blur()
    cy.get("#passwordConfirm").type("testtest")
    cy.get("#passwordConfirm").blur()
    cy.get(".group").should("be.enabled")
    cy.get(".group").click()
    cy.contains("이미 사용 중인").should("be.visible")
  })

  it("should be able to sign up", () => {
    cy.get("#name").type("test")
    cy.get("#name").blur()
    cy.get("#email").type("test14@test14.com")
    cy.get("#email").blur()
    cy.get("#companyName").type("test14")
    cy.get("#companyName").blur()
    cy.get("#password").type("testtest")
    cy.get("#password").blur()
    cy.get("#passwordConfirm").type("testtest")
    cy.get("#passwordConfirm").blur()
    cy.get(".group").should("be.enabled")
    cy.get(".group").click()
    cy.contains("사용자 생성").should("be.visible")
  })

  it("should be able to visit login page", () => {
    cy.contains("로그인").click()
    cy.location("pathname").should("contains", "/auth")
  })
})
