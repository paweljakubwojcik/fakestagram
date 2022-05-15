import classnames from "classnames"
import { useAuth } from "hooks/use-auth"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import sloth from "public/sloth.jpg"
import { ComponentPropsWithoutRef, FC } from "react"
import { Heart, Home, PlusSquare, Send } from "react-feather"
import { Button } from "./button"
import { Card } from "./card"
import { PopoverMenu } from "./popover-menu"

type NavbarProps = ComponentPropsWithoutRef<"header">

export const Navbar: FC<NavbarProps> = ({ className }) => {
  const router = useRouter()
  const { me, loading, logout } = useAuth()

  if (me === null) {
    router.push("/login")
  }

  if (loading ) return <div>Loading...</div>

  return (
    <Card component="header" className={classnames("flex m-0 py-0 px-4  w-full", className)}>
      <div className="flex py-3 flex-nowrap w-full max-w-main-content mx-auto">
        <h1 className="text-lg font-bold mr-auto block">
          <Link href={"/"}>
            <a>Instaclone</a>
          </Link>
        </h1>
        <div className="menu flex space-x-6">
          {me ? (
            <>
              <Button mode="inline">
                <Home />
              </Button>
              <Button mode="inline">
                <Send />
              </Button>
              <Button mode="inline">
                <PlusSquare />
              </Button>
              <Button mode="inline">
                <Heart />
              </Button>
              <PopoverMenu
                content={
                  <div className="w-52 flex flex-col items-stretch">
                    <Button mode="secondary" className="border-0" onClick={() => logout()}>
                      Log out
                    </Button>
                  </div>
                }
              >
                <Image
                  src={sloth}
                  alt={`${me?.username} profile image`}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </PopoverMenu>
            </>
          ) : (
            <>
              <Button mode="primary">Login</Button>
              <Button mode="secondary">Register</Button>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}