'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const publicClient = usePublicClient()
const walletClient = useWalletClient()

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePublicClient, useWalletClient } from "wagmi"
import { Transaction, parseAbi } from "viem"
import { useWriteContract } from "wagmi"

const formSchema = z.object({
  daoname: z.string().min(3).max(20),
  tokenname: z.string().min(3).max(20),
  tokensymbol: z.string().min(2).max(5),
  tokenholders: z.array(z.string()).min(1),
  tokenholdersamount: z.array(z.number()).min(1),
  minquorum: z.number().min(0).max(100),
  votingdelay: z.number().min(0).max(100),
  votingperiod: z.number().min(0).max(100),
  timelockdelay: z.number().min(0).max(100),
  initialamount: z.number().min(0),
  distributiontoken: z.string().min(1),
  amountdistributedmonthly: z.number().min(0),
  grantees: z.array(z.string()).min(1),
})

function CreatePage() {
  const [grantees, setGrantees] = useState([""])
  const [tokenholders, setTokenholders] = useState([""])

  const { writeContract } = useWriteContract()

  const addGrantee = () => {
    setGrantees([...grantees, ""])
  }

  const addTokenholder = () => {
    setTokenholders([...tokenholders, ""])
  }

  const handleGranteeChange = (index: number, value: string) => {
    const newGrantees = [...grantees]
    newGrantees[index] = value
    setGrantees(newGrantees)
    form.setValue("grantees", newGrantees)
  }

  const handleTokenholderChange = (index: number, value: string) => {
    const newTokenholders = [...tokenholders]
    newTokenholders[index] = value
    setTokenholders(newTokenholders)
    form.setValue("tokenholders", newTokenholders)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      daoname: "",
      tokenname: "",
      tokensymbol: "",
      tokenholders: [],
      tokenholdersamount: [],
      minquorum: 4,
      votingdelay: 1,
      votingperiod: 5,
      timelockdelay: 1,
      initialamount: 0,
      distributiontoken: "USDCx",
      amountdistributedmonthly: 0,
      grantees: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    writeContract({
      address: "0x1F98407AAeA6cAF4CfF4295A6273A4904e1F0Fea",
      abi: parseAbi(["function newDao(string memory _id, string memory _name, string memory _symbol, address[] memory _holders, uint256[] memory _stakes, uint256[5] memory _votingSettings)"]),
      functionName: "newDao",
      args: [values.daoname, values.tokenname, values.tokensymbol, values.tokenholders.map((address) => address as `0x${string}`), values.tokenholdersamount.map((amount) => BigInt(amount)), [BigInt(values.minquorum), BigInt(values.votingdelay), BigInt(values.votingperiod), BigInt(values.timelockdelay), BigInt(0)]],
    })
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="p-10 rounded-md">
            <h2 className="text-3xl font-bold mb-2">Create your organization</h2>
            <p className="text-gray-700 mb-6">
              Name and define your DAO parameters so grantees know they are joining the right organization.
            </p>
            <Card className="border border-yellow-300 rounded-lg mb-6 p-6">
              <CardHeader className="mb-4">
                <CardTitle className="text-xl font-semibold mb-2">Claim a name</CardTitle>
                <CardDescription className="text-gray-600">
                  QiBlaster uses the Ethereum Name Service (ENS) to assign names to organizations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="daoname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">DAO name</FormLabel>
                      <FormControl>
                        <Input className="w-full border border-gray-300 rounded-md p-2 mb-2" placeholder="qidao" {...field} />
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card className="border border-yellow-300 rounded-lg mb-6 p-6">
              <CardHeader className="mb-4">
                <CardTitle className="text-xl font-semibold mb-2">Token parameters</CardTitle>
                <CardDescription className="text-gray-600">
                  These settings will determine the name and symbol of the token that will be created for your organization. Add members to define the initial distribution of this token.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="tokenname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Token name</FormLabel>
                      <FormControl>
                        <Input className="w-full border border-gray-300 rounded-md p-2 mb-2" placeholder="QiToken" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tokensymbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Token symbol</FormLabel>
                      <FormControl>
                        <Input className="w-full border border-gray-300 rounded-md p-2 mb-2" placeholder="QI" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {tokenholders.map((tokenholder, index) => (
                  <div key={`tokenholders.${index}`} className="mb-4">
                    <FormField
                      control={form.control}
                      name={`tokenholders.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Token holder {index + 1}</FormLabel>
                          <FormControl>
                            <Input
                              className="w-full border border-gray-300 rounded-md p-2 mb-2"
                              type="text"
                              {...field}
                              value={tokenholder}
                              onChange={(e) => handleTokenholderChange(index, e.target.value)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`tokenholdersamount.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Token holder amount {index + 1}</FormLabel>
                          <FormControl>
                            <Input className="w-full border border-gray-300 rounded-md p-2 mb-2" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                <Button type="button" onClick={addTokenholder} className="bg-yellow-300 text-yellow-800 py-2 px-4 rounded-md hover:bg-yellow-400">
                  Add more
                </Button>
              </CardContent>
            </Card>
            <Card className="border border-yellow-300 rounded-lg mb-6 p-6">
              <CardHeader className="mb-4">
                <CardTitle className="text-xl font-semibold mb-2">Voting parameters</CardTitle>
                <CardDescription className="text-gray-600">
                  Think about these parameters as a balancing act between ease of passing proposals and security against malicious proposals. That's an important – and tough – tradeoff to get right!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="minquorum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Minimum quorum</FormLabel>
                      <FormControl>
                        <Slider className="w-full" defaultValue={[33]} max={100} step={1} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="votingdelay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Voting delay</FormLabel>
                      <FormControl>
                        <Input className="w-full border border-gray-300 rounded-md p-2 mb-2" type="number" placeholder="1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="votingperiod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Voting period</FormLabel>
                      <FormControl>
                        <Input className="w-full border border-gray-300 rounded-md p-2 mb-2" type="number" placeholder="5" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timelockdelay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Timelock delay</FormLabel>
                      <FormControl>
                        <Input className="w-full border border-gray-300 rounded-md p-2 mb-2" type="number" placeholder="1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border border-yellow-300 rounded-lg mb-6 p-6">
              <CardHeader className="mb-4">
                <CardTitle className="text-xl font-semibold mb-2">Distribution settings</CardTitle>
                <CardDescription className="text-gray-600">
                  These parameters will determine the treasury size, how it will be distributed and the grantees that will receive it.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="initialamount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Initial amount</FormLabel>
                      <FormControl>
                        <Input className="w-full border border-gray-300 rounded-md p-2 mb-2" type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="distributiontoken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Distribution token</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full border border-gray-300 rounded-md p-2 mb-2">
                            <SelectValue placeholder="Token" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USDCx">USDCx</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-500">
                        This is the token that will be used to distribute the treasury.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amountdistributedmonthly"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Amount distributed monthly</FormLabel>
                      <FormControl>
                        <Input className="w-full border border-gray-300 rounded-md p-2 mb-2" type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {grantees.map((grantee, index) => (
                  <FormField
                    key={`grantees.${index}`}
                    control={form.control}
                    name={`grantees.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Grantee {index + 1}</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full border border-gray-300 rounded-md p-2 mb-2"
                            type="text"
                            {...field}
                            value={grantee}
                            onChange={(e) => handleGranteeChange(index, e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="button" onClick={addGrantee} className="bg-yellow-300 text-yellow-800 py-2 px-4 rounded-md hover:bg-yellow-400">
                  Add more
                </Button>
              </CardContent>
            </Card>
            <Button type="submit" className="bg-yellow-500 text-white py-3 px-6 rounded-md hover:bg-yellow-600">
              Create DAO
            </Button>
          </div>
        </form>
      </Form>
    </>

  )
}

export default CreatePage
