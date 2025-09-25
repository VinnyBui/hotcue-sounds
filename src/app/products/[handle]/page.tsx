export default function ProductPage({ params }: { params: { handle: string } }) {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Dynamic Product Page</h1>
      <p>Handle: {params.handle}</p>
    </main>
  )
}
