import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import { Login } from "./Login"

const renderLogin = (props = {}) => {
  const setToken = jest.fn()
  render(
    <BrowserRouter>
      <Login setToken={setToken} {...props} />
    </BrowserRouter>
  )
  return { setToken }
}

describe("Login", () => {
  test("renders username and password fields and submit button", () => {
    renderLogin()
    expect(screen.getByPlaceholderText || screen.getByRole)
    // The form uses uncontrolled inputs without htmlFor, so query by role
    const textInputs = screen.getAllByRole("textbox")
    expect(textInputs.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument()
  })

  test("renders link to register page", () => {
    renderLogin()
    expect(screen.getByRole("link", { name: /cancel/i })).toHaveAttribute("href", "/register")
  })

  test("shows error message on failed login", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ valid: false }) })
    )

    renderLogin()

    // Fill in the form fields (useRef-based uncontrolled inputs)
    const submitButton = screen.getByRole("button", { name: /submit/i })
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/username or password not valid/i)).toBeInTheDocument()
    })
  })

  test("calls setToken on successful login", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          valid: true,
          token: "abc123tokenstring",
          user_id: 42,
          is_staff: false,
        }),
      })
    )

    const { setToken } = renderLogin()

    const submitButton = screen.getByRole("button", { name: /submit/i })
    userEvent.click(submitButton)

    await waitFor(() => {
      expect(setToken).toHaveBeenCalledWith("abc123tokenstring", 42, false)
    })
  })
})
