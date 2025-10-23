'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const nameSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
});

const teamSchema = z.object({
    favoriteTeams: z.array(z.string()).min(1, 'Please select at least one team'),
});

type NameFormValues = z.infer<typeof nameSchema>;
type TeamFormValues = z.infer<typeof teamSchema>;

// Mock teams data - in production, this would come from your database
const mockTeams = [
    { id: '1', name: 'Kansas City Chiefs', sport: 'NFL', city: 'Kansas City' },
    { id: '2', name: 'Buffalo Bills', sport: 'NFL', city: 'Buffalo' },
    { id: '3', name: 'Dallas Cowboys', sport: 'NFL', city: 'Dallas' },
    { id: '4', name: 'New York Yankees', sport: 'MLB', city: 'New York' },
    { id: '5', name: 'Boston Red Sox', sport: 'MLB', city: 'Boston' },
    { id: '6', name: 'Los Angeles Lakers', sport: 'NBA', city: 'Los Angeles' },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState<'name' | 'teams'>('name');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

    const nameForm = useForm<NameFormValues>({
        resolver: zodResolver(nameSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
        },
    });

    const teamForm = useForm<TeamFormValues>({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            favoriteTeams: [],
        },
    });

    const onNameSubmit = async (values: NameFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            // Update user profile
            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    displayName: `${values.firstName} ${values.lastName}`,
                }),
            });

            if (response.ok) {
                setStep('teams');
            } else {
                setError('Failed to save name');
            }
        } catch (error) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const onTeamSubmit = async (values: TeamFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            // Save favorite teams
            const response = await fetch('/api/user/favorite-teams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    teamIds: selectedTeams,
                }),
            });

            if (response.ok) {
                // Mark onboarding as completed
                await fetch('/api/user/complete-onboarding', {
                    method: 'POST',
                });

                router.push('/');
            } else {
                setError('Failed to save favorite teams');
            }
        } catch (error) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTeam = (teamId: string) => {
        setSelectedTeams(prev =>
            prev.includes(teamId)
                ? prev.filter(id => id !== teamId)
                : [...prev, teamId]
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="max-w-2xl w-full mx-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            {step === 'name' ? 'Welcome!' : 'Choose Your Teams'}
                        </h1>
                        <p className="text-white/70 mt-2">
                            {step === 'name'
                                ? 'Let\'s set up your profile'
                                : 'Select your favorite teams to get personalized updates'
                            }
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert className="mb-6 border-red-500/50 bg-red-500/10">
                            <AlertDescription className="text-red-200">{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Name Step */}
                    {step === 'name' && (
                        <Form {...nameForm}>
                            <form onSubmit={nameForm.handleSubmit(onNameSubmit)} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={nameForm.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-white">First Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="John"
                                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={nameForm.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-white">Last Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Doe"
                                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Continue'}
                                </Button>
                            </form>
                        </Form>
                    )}

                    {/* Teams Step */}
                    {step === 'teams' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {mockTeams.map((team) => (
                                    <Card
                                        key={team.id}
                                        className={`cursor-pointer transition-all ${selectedTeams.includes(team.id)
                                            ? 'bg-blue-500/20 border-blue-500'
                                            : 'bg-white/5 border-white/20 hover:bg-white/10'
                                            }`}
                                        onClick={() => toggleTeam(team.id)}
                                    >
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-white text-lg">{team.name}</CardTitle>
                                                <Badge variant="secondary" className="bg-white/20 text-white">
                                                    {team.sport.toUpperCase()}
                                                </Badge>
                                            </div>
                                            <CardDescription className="text-white/70">
                                                {team.city}
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>

                            <Button
                                onClick={() => {
                                    teamForm.setValue('favoriteTeams', selectedTeams);
                                    teamForm.handleSubmit(onTeamSubmit)();
                                }}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                disabled={isLoading || selectedTeams.length === 0}
                            >
                                {isLoading ? 'Saving...' : `Continue with ${selectedTeams.length} team${selectedTeams.length !== 1 ? 's' : ''}`}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                                onClick={() => setStep('name')}
                            >
                                ← Back to Name
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
